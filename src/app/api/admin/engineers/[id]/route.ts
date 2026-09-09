import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Engineer } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { engineerSchema } from "@/lib/validations/feedback";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { id } = await params;
  const parsed = engineerSchema.partial().safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const engineer = await Engineer.findByIdAndUpdate(id, parsed.data, { new: true });
  return NextResponse.json({ engineer });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManage(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { id } = await params;
  const deleted = await Engineer.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
