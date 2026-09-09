import { connectDB } from "@/lib/db";
import { Location } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const qr = searchParams.get("qr") || searchParams.get("location");
    const query: Record<string, unknown> = { isActive: true };
    if (type === "checkin" || type === "gate") query.type = type;
    if (qr) query.qrIdentifier = qr.toUpperCase();
    const locations = await Location.find(query).sort({ type: 1, code: 1 });
    return NextResponse.json({
      locations,
      location: locations[0] || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load locations" },
      { status: 500 }
    );
  }
}
