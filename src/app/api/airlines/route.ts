import { connectDB } from "@/lib/db";
import { Airline, Location } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const airlines = await Airline.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json({ airlines });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load airlines" },
      { status: 500 }
    );
  }
}
