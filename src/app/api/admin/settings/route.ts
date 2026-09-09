import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AdminUser, Settings } from "@/lib/models";
import { canManage, getSessionUser } from "@/lib/api-auth";
import { appUrl } from "@/lib/utils";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const settings =
    (await Settings.findOne({ key: "app" })) ||
    (await Settings.create({ key: "app", publicUrl: appUrl() }));
  const users = canManage(user.role)
    ? await AdminUser.find({}, "name email role isActive")
    : [];
  return NextResponse.json({
    settings,
    users,
    me: user,
  });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await request.json();

  if (body.publicUrl && canManage(user.role)) {
    await Settings.findOneAndUpdate(
      { key: "app" },
      { publicUrl: body.publicUrl, organization: body.organization },
      { upsert: true }
    );
  }

  if (body.currentPassword && body.newPassword) {
    const dbUser = await AdminUser.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const ok = await bcrypt.compare(body.currentPassword, dbUser.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Current password is wrong" }, { status: 400 });
    }
    dbUser.passwordHash = await bcrypt.hash(body.newPassword, 10);
    await dbUser.save();
  }

  return NextResponse.json({ ok: true });
}
