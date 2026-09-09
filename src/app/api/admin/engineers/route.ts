import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Engineer, Feedback } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { engineerSchema } from "@/lib/validations/feedback";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const engineers = await Engineer.find().sort({ name: 1 });
  const stats = await Promise.all(
    engineers.map(async (engineer) => {
      const items = await Feedback.find({ engineerId: engineer._id });
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
              (items.filter((i) => i.engineerAnswers.fullyResolved === "yes")
                .length /
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
    })
  );
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
