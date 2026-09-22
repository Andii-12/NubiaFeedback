import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airline, Feedback, Location } from "@/lib/models";
import { nextRequestId } from "@/lib/request-id";
import { feedbackSchema } from "@/lib/validations/feedback";
import {
  firstDetail,
  missingDeviceAnswer,
  orderedDevices,
  worstStatus,
} from "@/lib/device-answers";
import { isCompleteDate } from "@/lib/date-parts";
import type { DeviceAnswer } from "@/lib/device-answers";
import type { DeviceType } from "@/types";

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
    const locationIds = [...new Set(data.locationIds)];
    const found = await Location.find({
      _id: { $in: locationIds },
      isActive: true,
    });
    if (!airline || found.length !== locationIds.length) {
      return NextResponse.json(
        { error: "Airline эсвэл байршил олдсонгүй." },
        { status: 400 }
      );
    }

    const selectedTypes = new Set(data.locationTypes);
    if (found.some((item) => !selectedTypes.has(item.type))) {
      return NextResponse.json(
        { error: "Сонгосон байршил төрөлтэй таарахгүй байна." },
        { status: 400 }
      );
    }
    for (const type of selectedTypes) {
      if (!found.some((item) => item.type === type)) {
        return NextResponse.json(
          {
            error:
              type === "checkin"
                ? "Check-in ширээ сонгоно уу."
                : "Gate сонгоно уу.",
          },
          { status: 400 }
        );
      }
    }

    const byId = new Map(found.map((item) => [String(item._id), item]));
    const locations = locationIds.map((id) => byId.get(id)!);

    if (!isCompleteDate(data.date)) {
      return NextResponse.json({ error: "Огноо сонгоно уу." }, { status: 400 });
    }

    const answers = data.deviceAnswers as DeviceAnswer[];
    const devices = data.devices as DeviceType[];
    const missing = missingDeviceAnswer(devices, answers);
    if (missing) {
      return NextResponse.json({ error: missing }, { status: 400 });
    }
    const ordered = orderedDevices(devices).map(
      (device) => answers.find((item) => item.device === device)!
    );

    const requestId = await nextRequestId();
    const created = await Feedback.create({
      requestId,
      airlineId: data.airlineId,
      locationId: locations[0]._id,
      locationIds: locations.map((item) => item._id),
      locationType: data.locationTypes[0],
      locationTypes: data.locationTypes,
      date: data.date,
      time: data.time,
      shift: data.shift,
      devices: data.devices,
      technicalAnswers: {
        deviceStatus: worstStatus(ordered),
        printingStatus: firstDetail(devices, ordered, "print"),
        scanningStatus: firstDetail(devices, ordered, "scan"),
        workstationStatus: firstDetail(devices, ordered, "workstation"),
        impactLevel: data.impactLevel,
        deviceAnswers: ordered.map((item) => ({
          device: item.device,
          status: item.status,
          detail: item.detail || "",
        })),
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
      locationName: locations.map((item) => item.name).join(", "),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Илгээхэд алдаа гарлаа." },
      { status: 500 }
    );
  }
}
