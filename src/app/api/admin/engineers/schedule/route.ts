import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Duty } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { dutyBelongsToMonth, parseDutyWorkbook } from "@/lib/duty-schedule";
import { replaceDutySchedule } from "@/lib/save-duties";
import { rangeToDates } from "@/lib/date-range";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const rows = await Duty.find().populate("engineerId", "name").sort({ date: 1 });
  const today = rangeToDates("today").from;
  const currentMonth = today.slice(0, 7);
  const activeRows = rows.filter((row) =>
    dutyBelongsToMonth(
      { date: row.date, sheetMonth: row.sheetMonth || "" },
      currentMonth
    )
  );
  const byDate = new Map<string, { name: string; shift: string }[]>();
  for (const row of activeRows) {
    const engineer = row.engineerId as { name?: string } | null;
    const name = engineer?.name || "";
    if (!name) continue;
    const list = byDate.get(row.date) || [];
    list.push({ name, shift: row.shift || "" });
    byDate.set(row.date, list);
  }
  const days = [...byDate.entries()].map(([date, engineers]) => ({
    date,
    engineers,
  }));
  const todayEngineers = days.find((day) => day.date === today)?.engineers || [];
  return NextResponse.json({
    days,
    today,
    todayEngineers,
    expired: rows.length > 0 && days.length === 0,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Excel файл сонгоно уу." }, { status: 400 });
  }

  const parsed = parseDutyWorkbook(Buffer.from(await file.arrayBuffer()));
  const result = await replaceDutySchedule(parsed);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const today = rangeToDates("today").from;
  const currentMonth = today.slice(0, 7);
  const rows = await Duty.find();
  const ids = rows
    .filter((row) =>
      dutyBelongsToMonth(
        { date: row.date, sheetMonth: row.sheetMonth || "" },
        currentMonth
      )
    )
    .map((row) => row._id);
  if (ids.length) await Duty.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ cleared: ids.length });
}
