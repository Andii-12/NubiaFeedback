import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Duty, Feedback } from "@/lib/models";
import { getSessionUser } from "@/lib/api-auth";

type FeedbackItem = {
  date: string;
  devices: string[];
  engineerRating: number;
  engineerAnswers: { fullyResolved: string };
  locationId?: { name?: string } | string;
  locationIds?: ({ name?: string } | string)[];
  engineerId?: { name?: string } | string | null;
};

function summarize(items: FeedbackItem[]) {
  const deviceCount: Record<string, number> = {};
  const locationCount: Record<string, number> = {};
  const engineerRatings: Record<string, { sum: number; count: number }> = {};
  let resolved = 0;

  for (const item of items) {
    for (const device of item.devices) {
      deviceCount[device] = (deviceCount[device] || 0) + 1;
    }
    const named = (item.locationIds || [])
      .map((loc) => (typeof loc === "object" ? loc?.name || "" : ""))
      .filter(Boolean);
    const locs = named.length
      ? named
      : [
          typeof item.locationId === "object" ? item.locationId?.name || "" : "",
        ].filter(Boolean);
    for (const loc of locs) {
      locationCount[loc] = (locationCount[loc] || 0) + 1;
    }
    const eng =
      typeof item.engineerId === "object" && item.engineerId
        ? item.engineerId.name || ""
        : "";
    if (eng) {
      engineerRatings[eng] ??= { sum: 0, count: 0 };
      engineerRatings[eng].sum += item.engineerRating;
      engineerRatings[eng].count += 1;
    }
    if (item.engineerAnswers.fullyResolved === "yes") resolved += 1;
  }

  const topDevice =
    Object.entries(deviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const topLocation =
    Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const bestEngineer =
    Object.entries(engineerRatings)
      .map(([name, v]) => ({ name, avg: v.sum / v.count }))
      .sort((a, b) => b.avg - a.avg)[0] || null;
  const avgScore = items.length
    ? Math.round(
        (items.reduce((s, i) => s + i.engineerRating, 0) / items.length) * 10
      ) / 10
    : 0;

  return {
    total: items.length,
    mostProblematicDevice: topDevice,
    mostProblematicLocation: topLocation,
    bestEngineer: bestEngineer
      ? `${bestEngineer.name} (${bestEngineer.avg.toFixed(1)})`
      : "—",
    averageEngineerScore: avgScore,
    topIssueCategory: topDevice,
    resolvedPercent: items.length
      ? Math.round((resolved / items.length) * 100)
      : 0,
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const rows = await Feedback.find()
    .populate("locationId", "name")
    .populate("locationIds", "name")
    .populate("engineerId", "name")
    .sort({ date: 1 });

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
      ...summarize(byMonth[month] || []),
      duties: dutiesByMonth[month] || [],
    }));

  return NextResponse.json({
    overall: summarize(items),
    months,
  });
}
