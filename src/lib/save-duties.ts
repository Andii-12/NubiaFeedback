import { Duty, Engineer } from "@/lib/models";
import { dutyKey, personKey, timesheetMonth, type DutyRow } from "@/lib/duty-schedule";

export async function replaceDutySchedule(rows: DutyRow[]) {
  const unique = new Map<string, DutyRow>();
  for (const row of rows) unique.set(dutyKey(row), row);
  const duties = [...unique.values()];
  if (!duties.length) {
    return {
      error:
        "Хуваарь олдсонгүй. Огноо, Инженер баганатай жагсаалт эсвэл эхний баганад нэр, толгой мөрөнд огноо бүхий хүснэгт оруулна уу.",
    } as const;
  }

  const engineers = await Engineer.find();
  const byName = new Map(
    engineers.map((engineer) => [personKey(engineer.name), engineer])
  );
  const missing = [
    ...new Set(
      duties
        .map((row) => row.engineerName)
        .filter((name) => !byName.has(personKey(name)))
    ),
  ];
  if (missing.length) {
    return { error: `Инженер олдсонгүй: ${missing.join(", ")}` } as const;
  }

  const dates = [...new Set(duties.map((row) => row.date))];
  const sheetMonth = timesheetMonth(dates);
  await Duty.deleteMany({ date: { $in: dates } });
  await Duty.insertMany(
    duties.map((row) => ({
      date: row.date,
      engineerId: byName.get(personKey(row.engineerName))!._id,
      shift: row.shift,
      sheetMonth,
    }))
  );

  return { saved: duties.length, dates: dates.length } as const;
}
