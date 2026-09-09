import bcrypt from "bcryptjs";
import {
  AdminUser,
  Airline,
  Counter,
  Engineer,
  Feedback,
  Location,
  Settings,
} from "@/lib/models";
import type { DeviceType, ImpactLevel, LocationType } from "@/types";

let seeded = false;

const AIRLINES = [
  { name: "MIAT", code: "OM", logo: "OM" },
  { name: "Hunnu Air", code: "MR", logo: "MR" },
  { name: "T'way Air", code: "TW", logo: "TW" },
  { name: "Korean Air", code: "KE", logo: "KE" },
  { name: "Jeju Air", code: "7C", logo: "7C" },
  { name: "Jin Air", code: "LJ", logo: "LJ" },
  { name: "Aero K", code: "RF", logo: "RF" },
  { name: "Air Busan", code: "BX", logo: "BX" },
  { name: "Air China", code: "CA", logo: "CA" },
  { name: "China Southern", code: "CZ", logo: "CZ" },
  { name: "Asiana Airlines", code: "OZ", logo: "OZ" },
  { name: "Other", code: "OTH", logo: "OTH" },
];

function buildLocations() {
  const locations: {
    name: string;
    code: string;
    type: LocationType;
    qrIdentifier: string;
  }[] = [];

  for (let i = 1; i <= 20; i++) {
    const code = `A${String(i).padStart(2, "0")}`;
    locations.push({
      name: code,
      code,
      type: "checkin",
      qrIdentifier: code,
    });
  }
  for (let i = 1; i <= 10; i++) {
    const code = `C${String(i).padStart(2, "0")}`;
    locations.push({
      name: code,
      code,
      type: "checkin",
      qrIdentifier: code,
    });
  }
  for (let i = 1; i <= 4; i++) {
    const code = `D${String(i).padStart(2, "0")}`;
    locations.push({
      name: code,
      code,
      type: "checkin",
      qrIdentifier: code,
    });
  }
  for (let i = 1; i <= 6; i++) {
    const code = `GATE${String(i).padStart(2, "0")}`;
    locations.push({
      name: `Gate ${i}`,
      code,
      type: "gate",
      qrIdentifier: code,
    });
  }
  locations.push(
    {
      name: "Dom Gate 20",
      code: "DOMGATE20",
      type: "gate",
      qrIdentifier: "DOMGATE20",
    },
    {
      name: "Dom Gate 21",
      code: "DOMGATE21",
      type: "gate",
      qrIdentifier: "DOMGATE21",
    }
  );
  return locations;
}

const DEVICES: DeviceType[] = ["OCR", "BGR", "WS", "BTP", "BPP", "Network"];
const DEVICE_STATUS = ["normal", "slow", "intermittent", "down", "disconnected"];
const IMPACT: ImpactLevel[] = ["none", "low", "medium", "high", "critical"];
const SHIFTS = ["morning", "afternoon", "evening"] as const;
const RESPONSE = ["very_fast", "fast", "average", "slow", "very_slow"];
const RES_SPEED = ["yes", "partial", "no"];
const RESOLVED = ["yes", "temporary", "no"];
const COMM = ["excellent", "good", "average", "poor"];
const EXPLAIN = ["very_clear", "clear", "average", "unclear"];

function pick<T>(list: T[], index: number) {
  return list[index % list.length];
}

function sampleFeedback(
  airlines: { _id: unknown }[],
  locations: { _id: unknown; type: LocationType; name: string; code: string }[],
  engineers: { _id: unknown }[]
) {
  const records = [];
  const start = new Date("2026-08-22T00:00:00");

  for (let i = 0; i < 42; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + Math.floor(i * 0.42));
    const date = day.toISOString().slice(0, 10);
    const hour = 6 + (i % 14);
    const minute = (i * 7) % 60;
    const location = pick(locations, i * 3);
    const airline = pick(airlines, i * 2);
    const deviceCount = 1 + (i % 3);
    const devices = Array.from({ length: deviceCount }, (_, d) =>
      pick(DEVICES, i + d)
    ).filter((v, idx, arr) => arr.indexOf(v) === idx);
    const deviceStatus = pick(DEVICE_STATUS, i);
    const impactLevel = pick(IMPACT, i + 1);
    const rating = 3 + (i % 3) === 5 ? 5 : 2 + (i % 4);
    const engineerRating = Math.min(5, Math.max(1, rating));
    const fullyResolved = pick(RESOLVED, i);
    const printing = devices.some((d) => d === "BTP" || d === "BPP")
      ? pick(["normal", "slow", "jammed", "faded", "none"], i)
      : "";
    const scanning = devices.some((d) => d === "OCR" || d === "BGR")
      ? pick(["normal", "slow", "retries", "partial", "none"], i + 1)
      : "";
    const workstation = devices.some((d) => d === "WS" || d === "Network")
      ? pick(["normal", "slow", "frozen", "disconnected", "reboot"], i + 2)
      : "";

    records.push({
      requestId: `NUB-2026-${String(i + 1).padStart(4, "0")}`,
      airlineId: airline._id,
      locationId: location._id,
      locationType: location.type,
      date,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      shift: pick([...SHIFTS], i),
      devices,
      technicalAnswers: {
        deviceStatus,
        printingStatus: printing,
        scanningStatus: scanning,
        workstationStatus: workstation,
        impactLevel,
      },
      engineerAnswers: {
        responseSpeed: pick(RESPONSE, i),
        resolutionSpeed: pick(RES_SPEED, i),
        fullyResolved,
        communication: pick(COMM, i),
        explanationQuality: pick(EXPLAIN, i),
      },
      engineerRating,
      comment:
        i % 4 === 0
          ? `${location.name} дээр ${devices[0]} төхөөрөмж удаан ажилласан.`
          : "",
      engineerId: pick(engineers, i)._id,
      adminNotes:
        i % 7 === 0
          ? [
              {
                text: `Follow-up required for ${devices[0]} at ${location.name}.`,
                author: "NUBIA Admin",
                createdAt: day,
              },
            ]
          : [],
      createdAt: new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`),
    });
  }

  return records;
}

async function syncGateLocations() {
  const extraGates = ["GATE07", "GATE08", "GATE09", "GATE10", "GATE11", "GATE12"];
  await Location.updateMany(
    { type: "gate", code: { $in: extraGates } },
    { $set: { isActive: false } }
  );

  const gates = [
    ...Array.from({ length: 6 }, (_, i) => {
      const n = i + 1;
      const code = `GATE${String(n).padStart(2, "0")}`;
      return { name: `Gate ${n}`, code, qrIdentifier: code };
    }),
    {
      name: "Dom Gate 20",
      code: "DOMGATE20",
      qrIdentifier: "DOMGATE20",
    },
    {
      name: "Dom Gate 21",
      code: "DOMGATE21",
      qrIdentifier: "DOMGATE21",
    },
  ];

  for (const gate of gates) {
    await Location.findOneAndUpdate(
      { code: gate.code, type: "gate" },
      {
        $set: {
          name: gate.name,
          qrIdentifier: gate.qrIdentifier,
          type: "gate",
          isActive: true,
        },
        $setOnInsert: { code: gate.code },
      },
      { upsert: true }
    );
  }
}

export async function ensureSeeded() {
  if (seeded) return;
  const existing = await Airline.countDocuments();
  if (existing > 0) {
    await syncGateLocations();
    await Airline.updateMany(
      { code: "OM" },
      { $set: { name: "MIAT" } }
    );
    seeded = true;
    return;
  }

  const airlines = await Airline.insertMany(
    AIRLINES.map((a) => ({ ...a, isActive: true }))
  );
  const locations = await Location.insertMany(
    buildLocations().map((l) => ({ ...l, isActive: true }))
  );
  const engineers = await Engineer.insertMany([
    { name: "Bilguunzaya", email: "bilguunzaya@nubia.airport", isActive: true },
    { name: "Batbayar", email: "batbayar@nubia.airport", isActive: true },
    { name: "Oyungerel", email: "oyungerel@nubia.airport", isActive: true },
    { name: "Tuvshinbayar", email: "tuvshin@nubia.airport", isActive: true },
  ]);

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "NubiaAdmin2026!",
    10
  );
  const engineerHash = await bcrypt.hash(
    process.env.ENGINEER_PASSWORD || "NubiaEng2026!",
    10
  );
  const viewerHash = await bcrypt.hash(
    process.env.VIEWER_PASSWORD || "NubiaView2026!",
    10
  );

  await AdminUser.insertMany([
    {
      name: "NUBIA Admin",
      email: "admin@nubia.airport",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    {
      name: "AIS Engineer",
      email: "engineer@nubia.airport",
      passwordHash: engineerHash,
      role: "ENGINEER",
      isActive: true,
    },
    {
      name: "Operations Viewer",
      email: "viewer@nubia.airport",
      passwordHash: viewerHash,
      role: "VIEWER",
      isActive: true,
    },
  ]);

  await Settings.create({
    key: "app",
    publicUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    organization: "NUBIA AIS",
  });

  const feedback = sampleFeedback(airlines, locations, engineers);
  await Feedback.insertMany(feedback);
  await Counter.create({ key: "feedback-2026", seq: feedback.length });
  seeded = true;
}
