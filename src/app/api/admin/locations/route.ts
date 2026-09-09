import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Location } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { locationSchema } from "@/lib/validations/feedback";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const locations = await Location.find().sort({ type: 1, code: 1 });
  return NextResponse.json({ locations });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const parsed = locationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const code = parsed.data.code.toUpperCase();
  const location = await Location.create({
    ...parsed.data,
    code,
    qrIdentifier: (parsed.data.qrIdentifier || code).toUpperCase(),
    isActive: parsed.data.isActive ?? true,
  });
  return NextResponse.json({ location });
}
