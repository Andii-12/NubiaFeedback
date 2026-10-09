import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Duty, Engineer, Feedback } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { engineerSchema } from "@/lib/validations/feedback";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [engineers, duties, feedback] = await Promise.all([
    Engineer.find().sort({ name: 1 }),
    Duty.find().select("date engineerId"),
    Feedback.find().select(
      "date engineerId engineerRating engineerAnswers.fullyResolved engineerAnswers.responseSpeed"
    ),
  ]);
  const datesByEngineer = new Map<string, Set<string>>();
  for (const duty of duties) {
    const id = String(duty.engineerId);
    const dates = datesByEngineer.get(id) || new Set<string>();
    dates.add(duty.date);
    datesByEngineer.set(id, dates);
  }
  const stats = engineers.map((engineer) => {
    const id = String(engineer._id);
    const dates = datesByEngineer.get(id) || new Set<string>();
    const items = feedback.filter((item) => {
      const assigned = item.engineerId && String(item.engineerId) === id;
      return assigned || dates.has(item.date);
    });
    const total = items.length;
    const avg =
      total === 0
        ? 0
        : Math.round(
            (items.reduce((sum, i) => sum + i.engineerRating, 0) / total) * 10
          ) / 10;
    const resolved =
      total === 0
        ? 0
        : Math.round(
            (items.filter((i) => i.engineerAnswers.fullyResolved === "yes").length /
              total) *
              100
          );
    const responseScore =
      total === 0
        ? 0
        : Math.round(
            (items.filter((i) =>
              ["very_fast", "fast"].includes(i.engineerAnswers.responseSpeed)
            ).length /
              total) *
              100
          );
    return {
      ...engineer.toObject(),
      totalEvaluations: total,
      averageRating: avg,
      resolvedPercent: resolved,
      responseRating: responseScore,
    };
  });
  return NextResponse.json({ engineers: stats });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const parsed = engineerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const engineer = await Engineer.create({
    ...parsed.data,
    isActive: parsed.data.isActive ?? true,
  });
  return NextResponse.json({ engineer });
}
