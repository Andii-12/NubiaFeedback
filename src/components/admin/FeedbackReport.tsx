"use client";

import { formatDeviceAnswers } from "@/lib/device-answers";
import { optionLabel, type Locale } from "@/lib/i18n/options";

type CountRow = { key: string; count: number; issues?: number };

export type FeedbackReportData = {
  month?: string;
  total: number;
  issueCount: number;
  averageEngineerScore: number;
  ratedCount: number;
  resolvedPercent: number;
  resolvedKnown: number;
  devices: CountRow[];
  locations: CountRow[];
  airlines: CountRow[];
  shifts: CountRow[];
  speeds: CountRow[];
  resolutions: CountRow[];
  communications: CountRow[];
  entries: {
    date: string;
    time: string;
    shift: string;
    airline: string;
    location: string;
    devices: string[];
    deviceStatus: string;
    deviceAnswers: { device: string; status: string; detail?: string }[];
    note: string;
    rating: number;
    responseSpeed: string;
    resolutionSpeed: string;
    communication: string;
    issue: boolean;
  }[];
  duties?: { date: string; engineers: string[] }[];
};

const COPY = {
  mn: {
    brand: "NUBIA · AIS тайлан",
    overall: "Нэгдсэн тайлан",
    month: "Сарын тайлан",
    issued: "Гаргасан",
    responses: "Нийт хариу",
    issues: "Асуудалтай",
    rating: "Дундаж үнэлгээ",
    resolved: "Шийдвэрлэсэн",
    devices: "Төхөөрөмжөөр",
    locations: "Байршлаар",
    airlines: "Авиа компаниар",
    shifts: "Ээлжээр",
    service: "Инженерийн үйлчилгээ",
    speed: "Хариу өгсөн хурд",
    resolution: "Хурдан шийдсэн эсэх",
    communication: "Харилцаа",
    detail: "Дэлгэрэнгүй бүртгэл",
    duty: "Жижүүрийн хуваарь",
    name: "Нэр",
    count: "Тоо",
    share: "Хувь",
    problem: "Асуудал",
    date: "Огноо",
    time: "Цаг",
    airline: "Авиа компани",
    location: "Байршил",
    equipment: "Төхөөрөмж, төлөв",
    note: "Тэмдэглэл",
    engineer: "Инженер",
    empty: "Энэ хугацаанд бүртгэл алга.",
    issue: "Асуудал",
    ok: "Хэвийн",
    unrated: "үнэлгээгүй",
    ofKnown: "мэдэгдсэнээс",
  },
  en: {
    brand: "NUBIA · AIS report",
    overall: "Overall report",
    month: "Monthly report",
    issued: "Issued",
    responses: "Responses",
    issues: "With an issue",
    rating: "Average rating",
    resolved: "Resolved",
    devices: "By device",
    locations: "By location",
    airlines: "By airline",
    shifts: "By shift",
    service: "Engineer service",
    speed: "Response speed",
    resolution: "Resolved quickly",
    communication: "Communication",
    detail: "Response log",
    duty: "Duty roster",
    name: "Name",
    count: "Count",
    share: "Share",
    problem: "Issues",
    date: "Date",
    time: "Time",
    airline: "Airline",
    location: "Location",
    equipment: "Device and status",
    note: "Note",
    engineer: "Engineer",
    empty: "No records in this period.",
    issue: "Issue",
    ok: "Normal",
    unrated: "unrated",
    ofKnown: "of recorded",
  },
} as const;

const MONTHS = {
  mn: [
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
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

function monthLabel(month: string | undefined, locale: Locale) {
  if (!month) return "";
  const [year, mon] = month.split("-");
  const name = MONTHS[locale][Number(mon) - 1] || month;
  return locale === "mn" ? `${year} оны ${name}` : `${name} ${year}`;
}

export function FeedbackReport({
  report,
  locale,
}: {
  report: FeedbackReportData;
  locale: Locale;
}) {
  const t = COPY[locale];
  const title = report.month ? `${t.month} · ${monthLabel(report.month, locale)}` : t.overall;
  const now = new Date();
  const issued = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const score = report.ratedCount
    ? `${report.averageEngineerScore} / 5`
    : t.unrated;

  return (
    <article className="report-sheet overflow-hidden rounded-[18px] border border-border bg-white print:break-after-page print:rounded-none print:border-0">
      <header className="bg-navy px-6 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
              {t.brand}
            </div>
            <h3 className="mt-1 text-2xl font-semibold">{title}</h3>
          </div>
          <div className="text-right text-sm text-white/75">
            {t.issued}
            <div className="font-medium text-white">{issued}</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Headline label={t.responses} value={String(report.total)} />
          <Headline label={t.issues} value={String(report.issueCount)} />
          <Headline label={t.rating} value={score} />
          <Headline
            label={t.resolved}
            value={`${report.resolvedPercent}%`}
            hint={report.resolvedKnown ? `${report.resolvedKnown} ${t.ofKnown}` : ""}
          />
        </div>
      </header>

      <div className="space-y-6 p-6">
        {report.total === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Breakdown
                title={t.devices}
                rows={report.devices}
                total={report.total}
                locale={locale}
                group="device"
                showIssues
                columns={{ name: t.name, count: t.count, share: t.share, problem: t.problem }}
              />
              <Breakdown
                title={t.locations}
                rows={report.locations}
                total={report.total}
                locale={locale}
                columns={{ name: t.name, count: t.count, share: t.share, problem: t.problem }}
              />
              <Breakdown
                title={t.airlines}
                rows={report.airlines}
                total={report.total}
                locale={locale}
                columns={{ name: t.name, count: t.count, share: t.share, problem: t.problem }}
              />
              <Breakdown
                title={t.shifts}
                rows={report.shifts}
                total={report.total}
                locale={locale}
                group="shift"
                columns={{ name: t.name, count: t.count, share: t.share, problem: t.problem }}
              />
            </div>

            <section>
              <h4 className="text-sm font-semibold text-navy">{t.service}</h4>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                <MiniList title={t.speed} rows={report.speeds} locale={locale} group="speed" />
                <MiniList
                  title={t.resolution}
                  rows={report.resolutions}
                  locale={locale}
                  group="resolution"
                />
                <MiniList
                  title={t.communication}
                  rows={report.communications}
                  locale={locale}
                  group="communication"
                />
              </div>
            </section>
          </>
        )}

        {report.entries.length ? (
          <section>
            <h4 className="text-sm font-semibold text-navy">{t.detail}</h4>
            <div className="mt-2 overflow-x-auto rounded-[14px] border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-nubia-light text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t.date}</th>
                    <th className="px-3 py-2 font-medium">{t.time}</th>
                    <th className="px-3 py-2 font-medium">{t.airline}</th>
                    <th className="px-3 py-2 font-medium">{t.location}</th>
                    <th className="px-3 py-2 font-medium">{t.equipment}</th>
                    <th className="px-3 py-2 font-medium">{t.note}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.entries.map((entry, index) => {
                    const equipment =
                      formatDeviceAnswers(entry.deviceAnswers, locale) ||
                      entry.devices
                        .map((device) => optionLabel(locale, "device", device))
                        .join(", ") ||
                      "—";
                    return (
                      <tr key={`${entry.date}-${entry.time}-${index}`} className="border-t border-border align-top">
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-navy">
                          {entry.date}
                          <div className="text-[11px] font-normal text-muted-foreground">
                            {entry.issue ? t.issue : t.ok}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-navy">{entry.time || "—"}</td>
                        <td className="px-3 py-2 text-navy">{entry.airline || "—"}</td>
                        <td className="px-3 py-2 text-navy">{entry.location || "—"}</td>
                        <td className="px-3 py-2 text-navy">{equipment}</td>
                        <td className="px-3 py-2 text-navy">{entry.note || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {report.duties?.length ? (
          <section>
            <h4 className="text-sm font-semibold text-navy">{t.duty}</h4>
            <div className="mt-2 overflow-hidden rounded-[14px] border border-border">
              <table className="w-full text-sm">
                <thead className="bg-nubia-light text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t.date}</th>
                    <th className="px-3 py-2 font-medium">{t.engineer}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.duties.map((day) => (
                    <tr key={day.date} className="border-t border-border">
                      <td className="px-3 py-2 font-medium whitespace-nowrap text-navy">{day.date}</td>
                      <td className="px-3 py-2 text-navy">
                        {day.engineers
                          .map((name) => name.replace(/\((morning|afternoon|evening)\)/, (_, shift) => `(${optionLabel(locale, "shift", shift)})`))
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function Headline({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[12px] bg-white/10 px-3 py-3">
      <div className="text-[11px] text-white/65">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {hint ? <div className="text-[11px] text-white/55">{hint}</div> : null}
    </div>
  );
}

function Breakdown({
  title,
  rows,
  total,
  locale,
  group,
  showIssues = false,
  columns,
}: {
  title: string;
  rows: CountRow[];
  total: number;
  locale: Locale;
  group?: string;
  showIssues?: boolean;
  columns: { name: string; count: string; share: string; problem: string };
}) {
  const max = rows[0]?.count || 1;
  return (
    <section className="rounded-[14px] border border-border">
      <h4 className="border-b border-border px-3 py-2 text-sm font-semibold text-navy">{title}</h4>
      {rows.length === 0 ? (
        <p className="px-3 py-3 text-sm text-muted-foreground">—</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] text-muted-foreground">
            <tr>
              <th className="px-3 py-1.5 font-medium">{columns.name}</th>
              <th className="px-3 py-1.5 font-medium">{columns.count}</th>
              <th className="px-3 py-1.5 font-medium">{columns.share}</th>
              {showIssues ? <th className="px-3 py-1.5 font-medium">{columns.problem}</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pct = total ? Math.round((row.count / total) * 100) : 0;
              const width = Math.round((row.count / max) * 100);
              const label = group ? optionLabel(locale, group, row.key) : row.key;
              return (
                <tr key={row.key} className="border-t border-border">
                  <td className="px-3 py-2 text-navy">
                    <div>{label}</div>
                    <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-nubia-light">
                      <div className="h-full bg-primary" style={{ width: `${width}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-2 font-medium text-navy">{row.count}</td>
                  <td className="px-3 py-2 text-muted-foreground">{pct}%</td>
                  {showIssues ? <td className="px-3 py-2 text-navy">{row.issues || 0}</td> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

function MiniList({
  title,
  rows,
  locale,
  group,
}: {
  title: string;
  rows: CountRow[];
  locale: Locale;
  group: string;
}) {
  return (
    <div className="rounded-[14px] bg-nubia-light px-3 py-3">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      {rows.length === 0 ? (
        <div className="mt-2 text-sm text-navy">—</div>
      ) : (
        <ul className="mt-2 space-y-1">
          {rows.map((row) => (
            <li key={row.key} className="flex items-center justify-between gap-3 text-sm text-navy">
              <span>{optionLabel(locale, group, row.key)}</span>
              <span className="font-medium">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
