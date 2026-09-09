import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Engineer, Feedback } from "@/lib/models";
import { canWrite, getSessionUser } from "@/lib/api-auth";
import { toFeedbackDTO } from "@/lib/feedback-map";

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
    .populate("engineerId", "name");
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: toFeedbackDTO(row.toObject()) });
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

  if (body.note) {
    row.adminNotes.push({
      text: String(body.note),
      author: user.name || user.email,
      createdAt: new Date(),
    });
  }
  if (body.engineerId) {
    const engineer = await Engineer.findById(body.engineerId);
    if (engineer) row.engineerId = engineer._id;
  }
  await row.save();
  const populated = await Feedback.findById(id)
    .populate("airlineId", "name code")
    .populate("locationId", "name code type")
    .populate("engineerId", "name");
  return NextResponse.json({ item: toFeedbackDTO(populated!.toObject()) });
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
