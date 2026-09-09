import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Location } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { locationSchema } from "@/lib/validations/feedback";

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
  const parsed = locationSchema.partial().safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const update = { ...parsed.data };
  if (update.code) update.code = update.code.toUpperCase();
  if (update.qrIdentifier)
    update.qrIdentifier = update.qrIdentifier.toUpperCase();
  const location = await Location.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ location });
}
