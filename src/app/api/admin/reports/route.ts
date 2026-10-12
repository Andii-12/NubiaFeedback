import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Duty, Feedback } from "@/lib/models";
import { getSessionUser } from "@/lib/api-auth";

type Named = { name?: string } | string | null | undefined;

type Answer = { device: string; status: string; detail?: string };

type FeedbackItem = {
  date: string;
  time?: string;
  shift?: string;
  devices?: string[];
  comment?: string;
  engineerRating?: number;
  airlineId?: Named;
  locationId?: Named;
  locationIds?: Named[];
  technicalAnswers?: {
    deviceStatus?: string;
    deviceAnswers?: Answer[];
  } | null;
  engineerAnswers?: {
    fullyResolved?: string;
    responseSpeed?: string;
    resolutionSpeed?: string;
    communication?: string;
    resolutionNote?: string;
    communicationNote?: string;
  } | null;
};

function nameOf(value: Named) {
  if (!value || typeof value === "string") return "";
  return value.name || "";
}

function bump(map: Record<string, number>, key: string) {
  if (!key) return;
  map[key] = (map[key] || 0) + 1;
}

function ranked(map: Record<string, number>) {
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function summarize(items: FeedbackItem[], withEntries: boolean) {
  const devices: Record<string, number> = {};
  const deviceIssues: Record<string, number> = {};
  const locations: Record<string, number> = {};
  const airlines: Record<string, number> = {};
  const shifts: Record<string, number> = {};
  const speeds: Record<string, number> = {};
  const resolutions: Record<string, number> = {};
  const communications: Record<string, number> = {};
  let issues = 0;
  let resolvedYes = 0;
  let resolvedKnown = 0;
  let ratingSum = 0;
  let rated = 0;

  const entries = items.map((item) => {
    for (const device of item.devices || []) bump(devices, device);
    const places = (item.locationIds || []).map(nameOf).filter(Boolean);
    const location = places.length ? places : [nameOf(item.locationId)].filter(Boolean);
    for (const place of location) bump(locations, place);
    bump(airlines, nameOf(item.airlineId));
    bump(shifts, item.shift || "");

    const answers = item.technicalAnswers?.deviceAnswers || [];
    for (const answer of answers) {
      if (answer.status && answer.status !== "normal") bump(deviceIssues, answer.device);
    }
    const hasIssue =
      Boolean(
        item.technicalAnswers?.deviceStatus &&
          item.technicalAnswers.deviceStatus !== "normal"
      ) || answers.some((answer) => answer.status && answer.status !== "normal");
    if (hasIssue) issues += 1;

    const engineer = item.engineerAnswers;
    const resolved = engineer?.fullyResolved || "";
    if (resolved === "yes" || resolved === "no" || resolved === "temporary") {
      resolvedKnown += 1;
      if (resolved === "yes") resolvedYes += 1;
    }
    if ((item.engineerRating || 0) >= 1) {
      ratingSum += item.engineerRating || 0;
      rated += 1;
    }
    bump(speeds, engineer?.responseSpeed || "");
    bump(resolutions, engineer?.resolutionSpeed || "");
    bump(communications, engineer?.communication || "");

    const notes = [engineer?.resolutionNote, engineer?.communicationNote, item.comment]
      .map((note) => (note || "").trim())
      .filter(Boolean);

    return {
      date: item.date,
      time: item.time || "",
      shift: item.shift || "",
      airline: nameOf(item.airlineId),
      location: location.join(", "),
      devices: item.devices || [],
      deviceStatus: item.technicalAnswers?.deviceStatus || "",
      deviceAnswers: answers.map((answer) => ({
        device: answer.device,
        status: answer.status,
        detail: answer.detail || "",
      })),
      note: notes.join(" · "),
      rating: item.engineerRating || 0,
      responseSpeed: engineer?.responseSpeed || "",
      resolutionSpeed: engineer?.resolutionSpeed || "",
      communication: engineer?.communication || "",
      issue: hasIssue,
    };
  });

  entries.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return {
    total: items.length,
    issueCount: issues,
    averageEngineerScore: rated ? Math.round((ratingSum / rated) * 10) / 10 : 0,
    ratedCount: rated,
    resolvedPercent: resolvedKnown ? Math.round((resolvedYes / resolvedKnown) * 100) : 0,
    resolvedKnown,
    devices: ranked(devices).map((row) => ({
      ...row,
      issues: deviceIssues[row.key] || 0,
    })),
    locations: ranked(locations),
    airlines: ranked(airlines),
    shifts: ranked(shifts),
    speeds: ranked(speeds),
    resolutions: ranked(resolutions),
    communications: ranked(communications),
    entries: withEntries ? entries : [],
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const rows = await Feedback.find()
    .populate("airlineId", "name")
    .populate("locationId", "name")
    .populate("locationIds", "name")
    .sort({ date: 1, time: 1 });

  const items = rows.map((row) => row.toObject() as FeedbackItem);
  const byMonth: Record<string, FeedbackItem[]> = {};
  for (const item of items) {
    const month = item.date.slice(0, 7);
    byMonth[month] ??= [];
    byMonth[month].push(item);
  }

  const dutyRows = await Duty.find().populate("engineerId", "name").sort({ date: 1 });
  const dutiesByMonth: Record<string, { date: string; engineers: string[] }[]> = {};
  const byDate = new Map<string, string[]>();
  for (const row of dutyRows) {
    const engineer = row.engineerId as { name?: string } | null;
    const name = engineer?.name || "";
    if (!name) continue;
    const label = row.shift ? `${name} (${row.shift})` : name;
    const list = byDate.get(row.date) || [];
    list.push(label);
    byDate.set(row.date, list);
  }
  for (const [date, engineers] of byDate) {
    const month = date.slice(0, 7);
    dutiesByMonth[month] ??= [];
    dutiesByMonth[month].push({ date, engineers });
  }

  const months = [
    ...new Set([...Object.keys(byMonth), ...Object.keys(dutiesByMonth)]),
  ]
    .sort((a, b) => b.localeCompare(a))
    .map((month) => ({
      month,
      ...summarize(byMonth[month] || [], true),
      duties: dutiesByMonth[month] || [],
    }));

  return NextResponse.json({
    overall: { ...summarize(items, false), duties: [] },
    months,
  });
}
