import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airline } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { airlineSchema } from "@/lib/validations/feedback";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const airlines = await Airline.find().sort({ name: 1 });
  return NextResponse.json({ airlines });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const parsed = airlineSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const airline = await Airline.create({
    ...parsed.data,
    code: parsed.data.code.toUpperCase(),
    isActive: parsed.data.isActive ?? true,
  });
  return NextResponse.json({ airline });
}
