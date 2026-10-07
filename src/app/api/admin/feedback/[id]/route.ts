import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Engineer, Feedback } from "@/lib/models";
import { canWrite, getSessionUser } from "@/lib/api-auth";
import { toFeedbackDTO } from "@/lib/feedback-map";
import { dutyNamesForDates } from "@/lib/duty-names";
import { labels } from "@/lib/labels";
import { sendWorkMail } from "@/lib/mail";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const row = await Feedback.findById(id)
    .populate("airlineId", "name code")
    .populate("locationId", "name code type")
    .populate("locationIds", "name code type")
    .populate("engineerId", "name");
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const item = toFeedbackDTO(row.toObject());
  const onDuty = await dutyNamesForDates([item.date]);
  return NextResponse.json({
    item: { ...item, dutyEngineers: onDuty.get(item.date) || [] },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const row = await Feedback.findById(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const note = String(body.note || "").trim();
  if (!note) {
    return NextResponse.json({ error: "Тэмдэглэл бичнэ үү." }, { status: 400 });
  }
  const engineer = await Engineer.findById(body.engineerId);
  const to = engineer?.email?.trim() || "";
  if (!engineer || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json(
      { error: "Ажлын имэйлтэй инженер сонгоно уу." },
      { status: 400 }
    );
  }

  await row.populate([
    { path: "airlineId", select: "name code" },
    { path: "locationId", select: "name code type" },
    { path: "locationIds", select: "name code type" },
  ]);
  const preview = toFeedbackDTO(row.toObject());
  const lines = [
    `Сайн байна уу, ${engineer.name}`,
    "",
    note,
    "",
    `Дугаар: ${preview.requestId}`,
    `Огноо: ${preview.date} ${preview.time}`,
    `Авиакомпани: ${preview.airlineName || "—"}`,
    `Байршил: ${preview.locationName || "—"}`,
    `Төхөөрөмж: ${labels.devices(preview.devices)}`,
    `Ажиллагаа: ${labels.deviceReport(preview.technicalAnswers.deviceAnswers, preview.technicalAnswers.deviceStatus)}`,
    `Үнэлгээ: ${preview.engineerRating} / 5`,
  ];
  if (preview.comment) lines.push(`Сэтгэгдэл: ${preview.comment}`);
  lines.push("", `Илгээсэн: ${user.name || user.email}`);
  const text = lines.join("\n");

  try {
    await sendWorkMail({
      to,
      subject: `NUBIA Feedback ${preview.requestId}`,
      text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "SMTP_NOT_CONFIGURED") {
      return NextResponse.json(
        {
          error:
            "Ажлын имэйл илгээх тохиргоо алга. .env дээр SMTP_HOST, SMTP_USER, SMTP_PASS нэмнэ үү.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Имэйл илгээж чадсангүй. SMTP тохиргоогоо шалгана уу." },
      { status: 502 }
    );
  }

  row.adminNotes.push({
    text: note,
    author: `${user.name || user.email} → ${to}`,
    createdAt: new Date(),
  });
  row.engineerId = engineer._id;
  await row.save();
  const populated = await Feedback.findById(id)
    .populate("airlineId", "name code")
    .populate("locationId", "name code type")
    .populate("locationIds", "name code type")
    .populate("engineerId", "name");
  const item = toFeedbackDTO(populated!.toObject());
  const onDuty = await dutyNamesForDates([item.date]);
  return NextResponse.json({
    item: { ...item, dutyEngineers: onDuty.get(item.date) || [] },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { id } = await params;
  const deleted = await Feedback.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
