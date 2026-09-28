const MONTHS = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

export { MONTHS };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function parseDateParts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const now = new Date();
  if (!match) {
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function toDateString(year: number, month: number, day: number) {
  const max = daysInMonth(year, month);
  const safeDay = Math.min(Math.max(day, 1), max);
  return `${year}-${pad(month)}-${pad(safeDay)}`;
}

export function isCompleteDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return false;
  return day >= 1 && day <= daysInMonth(year, month);
}

export function todayParts() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function clampDateToToday(value: string) {
  const today = todayParts();
  const parts = parseDateParts(value);
  let { year, month, day } = parts;

  if (year > today.year) {
    year = today.year;
    month = today.month;
    day = today.day;
  } else if (year === today.year && month > today.month) {
    month = today.month;
  }

  const monthLength = daysInMonth(year, month);
  const maxDay =
    year === today.year && month === today.month
      ? Math.min(monthLength, today.day)
      : monthLength;
  day = Math.min(Math.max(day, 1), maxDay);
  return toDateString(year, month, day);
}

export function isOnOrBeforeToday(value: string) {
  return isCompleteDate(value) && clampDateToToday(value) === value;
}

export function dateYearOptions() {
  const currentYear = new Date().getFullYear();
  return [currentYear, currentYear - 1, currentYear - 2];
}
