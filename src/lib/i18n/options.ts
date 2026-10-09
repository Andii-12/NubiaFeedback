export type Locale = "mn" | "en";

type Pair = Record<Locale, string>;

const TEXT: Record<string, Record<string, Pair>> = {
  device: {
    OCR: { mn: "Keyboard / Swipe", en: "Keyboard / Swipe" },
    BGR: { mn: "BGR", en: "BGR" },
    WS: { mn: "DCS program", en: "DCS program" },
    BTP: { mn: "BTP", en: "BTP" },
    BPP: { mn: "BPP", en: "BPP" },
    DCP: { mn: "DCP", en: "DCP" },
    Network: { mn: "Network", en: "Network" },
    Mouse: { mn: "Mouse", en: "Mouse" },
    Monitor: { mn: "Monitor", en: "Monitor" },
    Other: { mn: "Бусад", en: "Other" },
  },
  hint: {
    BGR: { mn: "Barcode уншигч", en: "Barcode reader" },
    BTP: { mn: "Ачааны пайз хэвлэгч", en: "Bag tag printer" },
    BPP: { mn: "Суугчийн талон хэвлэгч", en: "Boarding pass printer" },
    DCP: { mn: "Жагсаалт хэвлэгч", en: "Document printer" },
    Network: { mn: "Сүлжээ", en: "Network" },
    Other: { mn: "Mouse, Monitor", en: "Mouse, Monitor" },
  },
  status: {
    normal: { mn: "Хэвийн", en: "Normal" },
    slow: { mn: "Удаан", en: "Slow" },
    down: { mn: "Ажиллахгүй", en: "Not working" },
    wasDown: { mn: "Ажиллахгүй байсан", en: "Was not working" },
    disconnected: { mn: "Тасалдаж байсан", en: "Disconnected" },
    intermittent: { mn: "Хааяа ажиллахгүй", en: "Intermittent" },
  },
  print: {
    normal: { mn: "Хэвийн хэвлэж байсан", en: "Printed normally" },
    slow: { mn: "Удаан хэвлэж байсан", en: "Printed slowly" },
    jammed: { mn: "Цаас гацсан", en: "Paper jam" },
    faded: { mn: "Бүдэг хэвлэсэн", en: "Faded print" },
    none: { mn: "Огт хэвлээгүй", en: "Did not print" },
    nocut: { mn: "Цаасаа таслахгүй байсан", en: "Was not cutting the paper" },
    tangled: { mn: "Цаас дамарт орооцолдсон", en: "Paper tangled on the reel" },
    streaked: { mn: "Зураастай хэвлэсэн", en: "Printed with streaks" },
    noprint: { mn: "Хэвлэхгүй байсан", en: "Was not printing" },
    chewed: { mn: "Цаасаа зажилсан", en: "Chewed the paper" },
  },
  scan: {
    normal: { mn: "Хэвийн уншсан", en: "Read normally" },
    retries: { mn: "Олон дахин оролдсон", en: "Needed several tries" },
    partial: { mn: "Заримдаа уншаагүй", en: "Sometimes did not read" },
    none: { mn: "Огт уншаагүй", en: "Did not read" },
    slow: { mn: "Удаан уншсан", en: "Read slowly" },
    misread: { mn: "Алдаж уншсан", en: "Read incorrectly" },
    keys: { mn: "Үсэг ажиллахгүй байсан", en: "Keys were not working" },
    unread: { mn: "Уншихгүй байсан", en: "Was not reading" },
  },
  work: {
    normal: { mn: "Хэвийн", en: "Normal" },
    slow: { mn: "Удаан", en: "Slow" },
    frozen: { mn: "Гацсан", en: "Frozen" },
    disconnected: { mn: "Холболт тасарсан", en: "Connection lost" },
    reboot: { mn: "Дахин асаах шаардлагатай болсон", en: "Needed a restart" },
    offline: { mn: "Сүлжээгүй болсон", en: "Lost network" },
    cut: { mn: "Тасарсан", en: "Disconnected" },
  },
  impact: {
    none: { mn: "Нөлөөлөөгүй", en: "No impact" },
    low: { mn: "Бага зэрэг нөлөөлсөн", en: "Slight impact" },
    medium: { mn: "Ажил удаашруулсан", en: "Slowed the work" },
    high: { mn: "Түр хугацаанд ажиллах боломжгүй болсон", en: "Temporarily unusable" },
    critical: { mn: "Check-in / Boarding зогссон", en: "Check-in / boarding stopped" },
  },
  speed: {
    very_fast: { mn: "Маш хурдан", en: "Very fast" },
    fast: { mn: "Хурдан", en: "Fast" },
    average: { mn: "Дундаж", en: "Average" },
    slow: { mn: "Удаан", en: "Slow" },
    very_slow: { mn: "Маш удаан", en: "Very slow" },
  },
  resolution: {
    yes: { mn: "Тийм", en: "Yes" },
    partial: { mn: "Хэсэгчлэн", en: "Partially" },
    no: { mn: "Үгүй", en: "No" },
  },
  resolved: {
    yes: { mn: "Тийм", en: "Yes" },
    temporary: { mn: "Түр шийдэгдсэн", en: "Temporarily resolved" },
    no: { mn: "Үгүй", en: "No" },
  },
  communication: {
    excellent: { mn: "Маш сайн", en: "Excellent" },
    good: { mn: "Сайн", en: "Good" },
    average: { mn: "Дундаж", en: "Average" },
    poor: { mn: "Муу", en: "Poor" },
  },
  explanation: {
    very_clear: { mn: "Маш ойлгомжтой", en: "Very clear" },
    clear: { mn: "Ойлгомжтой", en: "Clear" },
    average: { mn: "Дундаж", en: "Average" },
    unclear: { mn: "Ойлгомжгүй", en: "Unclear" },
  },
  rating: {
    "1": { mn: "Маш муу", en: "Very poor" },
    "2": { mn: "Муу", en: "Poor" },
    "3": { mn: "Дундаж", en: "Average" },
    "4": { mn: "Сайн", en: "Good" },
    "5": { mn: "Маш сайн", en: "Excellent" },
  },
  shift: {
    morning: { mn: "Өглөө", en: "Morning" },
    afternoon: { mn: "Өдөр", en: "Afternoon" },
    evening: { mn: "Орой", en: "Evening" },
  },
};

const LINE: Record<string, Pair> = {
  pickStatus: {
    mn: "{name} ажиллагааг сонгоно уу.",
    en: "Select how {name} was working.",
  },
  pickDetail: {
    mn: "{name} дэлгэрэнгүй ажиллагааг сонгоно уу.",
    en: "Select the {name} details.",
  },
  printQ: {
    mn: "{name} хэвлэлт ямар байсан бэ?",
    en: "How was {name} printing?",
  },
  scanQ: {
    mn: "{name} уншилт ямар байсан бэ?",
    en: "How was {name} reading?",
  },
  systemQ: {
    mn: "{name} систем ямар байсан бэ?",
    en: "How was the {name} system?",
  },
  dcsQ: {
    mn: "Танай DCS систем ямар байсан бэ?",
    en: "How was your DCS system?",
  },
};

export function optionLabel(locale: Locale, group: string, value?: string | null) {
  if (!value) return "—";
  return TEXT[group]?.[value]?.[locale] || value;
}

export function line(locale: Locale, key: string, name = "") {
  return (LINE[key]?.[locale] || "").replaceAll("{name}", name);
}
