import { Duty } from "@/lib/models";

export async function dutyNamesForDates(dates: string[]) {
  const unique = [...new Set(dates.filter(Boolean))];
  const map = new Map<string, string[]>();
  if (!unique.length) return map;

  const rows = await Duty.find({ date: { $in: unique } }).populate(
    "engineerId",
    "name"
  );
  for (const row of rows) {
    const engineer = row.engineerId as { name?: string } | null;
    const name = engineer?.name?.trim() || "";
    if (!name) continue;
    const list = map.get(row.date) || [];
    if (!list.includes(name)) list.push(name);
    map.set(row.date, list);
  }
  return map;
}
