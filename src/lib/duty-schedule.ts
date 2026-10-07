import * as XLSX from "xlsx";

export type DutyRow = {
  date: string;
  engineerName: string;
  shift: string;
};

const NAME_HEADERS = new Set([
  "инженер",
  "инженерүүд",
  "нэр",
  "name",
  "engineer",
  "engineers",
  "ажилтан",
]);
const DATE_HEADERS = new Set(["огноо", "date", "өдөр"]);
const SHIFT_HEADERS = new Set(["ээлж", "shift"]);

function clean(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function headerKey(value: unknown) {
  return clean(value).toLowerCase();
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function fromParts(year: number, month: number, day: number) {
  if (year < 100) year += 2000;
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  const check = new Date(year, month - 1, day);
  if (
    check.getFullYear() !== year ||
    check.getMonth() !== month - 1 ||
    check.getDate() !== day
  ) {
    return "";
  }
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function toDateString(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const iso = value.toISOString();
    if (iso.endsWith("T00:00:00.000Z")) return iso.slice(0, 10);
    return fromParts(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }
  if (typeof value === "number" && value > 20000 && value < 80000) {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return fromParts(parsed.y, parsed.m, parsed.d);
  }
  const text = clean(value);
  if (!text) return "";
  const iso = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/.exec(text);
  if (iso) return fromParts(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  const local = /^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/.exec(text);
  if (local) return fromParts(Number(local[3]), Number(local[2]), Number(local[1]));
  const monthDay = /^(\d{1,2})\.(\d{1,2})$/.exec(text);
  if (monthDay) {
    const month = Number(monthDay[1]);
    const fraction = monthDay[2];
    const day = fraction.length === 1 ? Number(fraction) * 10 : Number(fraction);
    const now = new Date();
    let year = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (currentMonth >= 10 && month <= 2) year += 1;
    if (currentMonth <= 2 && month >= 11) year -= 1;
    return fromParts(year, month, day);
  }
  return "";
}

function isOnDuty(value: unknown) {
  const text = clean(value);
  if (!text) return false;
  const lower = text.toLowerCase();
  return !["0", "-", "—", "үгүй", "no", "off", "амрана"].includes(lower);
}

function shiftLabel(value: unknown) {
  const text = clean(value);
  const lower = text.toLowerCase();
  if (["1", "x", "✓", "✔", "тийм", "yes", "on"].includes(lower)) return "";
  if (/^\d+$/.test(lower)) return "";
  return text;
}

function rowsFromList(table: unknown[][]) {
  const header = table[0].map(headerKey);
  const nameIdx = header.findIndex((item) => NAME_HEADERS.has(item));
  const dateIdx = header.findIndex((item) => DATE_HEADERS.has(item));
  if (nameIdx < 0 || dateIdx < 0) return null;
  const shiftIdx = header.findIndex((item) => SHIFT_HEADERS.has(item));
  const rows: DutyRow[] = [];
  for (const line of table.slice(1)) {
    const engineerName = clean(line[nameIdx]);
    const date = toDateString(line[dateIdx]);
    if (!engineerName || !date) continue;
    const shift = shiftIdx >= 0 ? shiftLabel(line[shiftIdx]) : "";
    rows.push({ date, engineerName, shift });
  }
  return rows;
}

function rowsFromGrid(table: unknown[][]) {
  const dates = table[0].map((cell, index) => (index === 0 ? "" : toDateString(cell)));
  if (dates.filter(Boolean).length < 1) return null;
  const rows: DutyRow[] = [];
  for (const line of table.slice(1)) {
    const engineerName = clean(line[0]);
    if (!engineerName || NAME_HEADERS.has(engineerName.toLowerCase())) continue;
    dates.forEach((date, index) => {
      if (!date || !isOnDuty(line[index])) return;
      rows.push({ date, engineerName, shift: shiftLabel(line[index]) });
    });
  }
  return rows;
}

export function parseDutyWorkbook(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];
  const table = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: "",
    blankrows: false,
  }) as unknown[][];
  if (table.length < 2) return [];
  return rowsFromList(table) ?? rowsFromGrid(table) ?? [];
}

const CYRILLIC: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  ө: "u",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ү: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ы: "i",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function personKey(name: string) {
  let latin = "";
  for (const char of name.trim().toLowerCase()) {
    latin += CYRILLIC[char] ?? char;
  }
  return latin.replace(/kh/g, "h").replace(/[^a-z0-9]/g, "");
}

export function dutyKey(row: Pick<DutyRow, "date" | "engineerName">) {
  return `${row.date}|${personKey(row.engineerName)}`;
}

export function timesheetMonth(dates: string[]) {
  const counts = new Map<string, number>();
  for (const date of dates) {
    const month = date.slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(month)) continue;
    counts.set(month, (counts.get(month) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

export function dutyBelongsToMonth(
  row: { date: string; sheetMonth?: string },
  month: string
) {
  return (row.sheetMonth || row.date.slice(0, 7)) === month;
}
