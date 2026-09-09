import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airline, Feedback, Location } from "@/lib/models";
import { nextRequestId } from "@/lib/request-id";
import { feedbackSchema } from "@/lib/validations/feedback";
import { PRINT_DEVICES, SCAN_DEVICES, WS_DEVICES } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = feedbackSchema.safeParse({
      ...body,
      engineerRating: Number(body.engineerRating),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Мэдээлэл дутуу байна." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const airline = await Airline.findById(data.airlineId);
    const location = await Location.findById(data.locationId);
    if (!airline || !location) {
      return NextResponse.json(
        { error: "Airline эсвэл байршил олдсонгүй." },
        { status: 400 }
      );
    }

    if (data.devices.some((d) => PRINT_DEVICES.includes(d as never)) && !data.printingStatus) {
      return NextResponse.json(
        { error: "Хэвлэх төхөөрөмжийн ажиллагааг сонгоно уу." },
        { status: 400 }
      );
    }
    if (data.devices.some((d) => SCAN_DEVICES.includes(d as never)) && !data.scanningStatus) {
      return NextResponse.json(
        { error: "OCR / BGR уншилтыг сонгоно уу." },
        { status: 400 }
      );
    }
    if (data.devices.some((d) => WS_DEVICES.includes(d as never)) && !data.workstationStatus) {
      return NextResponse.json(
        { error: "WS / системийн ажиллагааг сонгоно уу." },
        { status: 400 }
      );
    }

    const requestId = await nextRequestId();
    const created = await Feedback.create({
      requestId,
      airlineId: data.airlineId,
      locationId: data.locationId,
      locationType: data.locationType,
      date: data.date,
      time: data.time,
      shift: data.shift,
      devices: data.devices,
      technicalAnswers: {
        deviceStatus: data.deviceStatus,
        printingStatus: data.printingStatus || "",
        scanningStatus: data.scanningStatus || "",
        workstationStatus: data.workstationStatus || "",
        impactLevel: data.impactLevel,
      },
      engineerAnswers: {
        responseSpeed: data.responseSpeed,
        resolutionSpeed: data.resolutionSpeed,
        fullyResolved: data.fullyResolved,
        communication: data.communication,
        explanationQuality: data.explanationQuality,
      },
      engineerRating: data.engineerRating,
      comment: data.comment || "",
    });

    return NextResponse.json({
      requestId: created.requestId,
      id: created._id,
      airlineName: airline.name,
      locationName: location.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Илгээхэд алдаа гарлаа." },
      { status: 500 }
    );
  }
}
