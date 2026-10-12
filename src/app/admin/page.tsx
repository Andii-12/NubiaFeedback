"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatsCard } from "@/components/admin/StatsCard";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { FeedbackReport, type FeedbackReportData } from "@/components/admin/FeedbackReport";
import { useI18n } from "@/components/i18n/LocaleProvider";

type Overview = {
  total: number;
  totalChange: number;
  today: number;
  issues: number;
  issuesChange: number;
  rating: number;
  ratingChange: number;
  critical: number;
  criticalChange: number;
};

type Analytics = {
  overview: Overview;
  devices: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  airlines: { name: string; count: number }[];
  ratings: { name: string; count: number }[];
  trend: { date: string; count: number }[];
  averageRating: number;
  resolution: { resolved: number; partial: number; notResolved: number };
};


export default function AdminDashboardPage() {
  const [onDuty, setOnDuty] = useState<{
    today: string;
    names: string[];
    expired: boolean;
  } | null>(null);
  const [data, setData] = useState<Analytics | null>(null);
  const [overall, setOverall] = useState<FeedbackReportData | null>(null);
  const [months, setMonths] = useState<FeedbackReportData[]>([]);
  const [engineers, setEngineers] = useState<
    {
      _id: string;
      name: string;
      isActive: boolean;
      averageRating: number;
      totalEvaluations: number;
    }[]
  >([]);
  const { t, locale } = useI18n();

  useEffect(() => {
    fetch("/api/admin/analytics?range=this_month")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) => setData(json || null))
      .catch(() => setData(null));
    fetch("/api/admin/engineers/schedule")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) =>
        setOnDuty(
          json
            ? {
                today: json.today || "",
                names: (json.todayEngineers || []).map(
                  (engineer: { name: string }) => engineer.name
                ),
                expired: Boolean(json.expired),
              }
            : null
        )
      )
      .catch(() => setOnDuty(null));
    fetch("/api/admin/engineers")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) => setEngineers(json?.engineers || []))
      .catch(() => setEngineers([]));
    fetch("/api/admin/reports")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) => {
        setOverall(json?.overall || null);
        setMonths(json?.months || []);
      })
      .catch(() => {
        setOverall(null);
        setMonths([]);
      });
  }, []);

  const overview = data?.overview;

  return (
    <AdminShell title={t.nav.dashboard}>
      <div className="no-print">
      <div className="mb-4 rounded-[16px] border border-border bg-white px-4 py-3">
        <div className="text-sm text-muted-foreground">
          {t.dash.today} {onDuty?.today ? `· ${onDuty.today}` : ""}
        </div>
        <div className="mt-1 text-lg font-semibold text-navy">
          {onDuty?.names.length
            ? onDuty.names.join(", ")
            : onDuty?.expired
              ? t.dash.expired
              : t.dash.none}
        </div>
        {onDuty && !onDuty.names.length ? (
          <Link href="/admin/engineers" className="mt-2 inline-block text-sm font-medium text-primary">
            {t.dash.add}
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label={t.dash.month}
          value={overview?.total ?? "—"}
          change={overview?.totalChange}
          hint={
            overview
              ? `${t.dash.todayCount} ${overview.today} · ${t.dash.vs}`
              : t.dash.vs
          }
        />
        <StatsCard
          label={t.dash.issues}
          value={overview?.issues ?? "—"}
          change={overview?.issuesChange}
          hint={t.dash.issuesHint}
        />
        <StatsCard
          label={t.dash.rating}
          value={overview ? `${overview.rating} / 5` : "—"}
          change={overview?.ratingChange}
        />
        <StatsCard
          label={t.dash.critical}
          value={overview?.critical ?? "—"}
          change={overview?.criticalChange}
        />
      </div>

      <EngineerRatings engineers={engineers} locale={locale} />

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy">{t.nav.analytics}</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Device Issue Count">
            <AnalyticsChart type="bar" data={data?.devices || []} xKey="name" yKey="count" />
          </Card>
          <Card title="Issues by Location">
            <AnalyticsChart type="bar" data={data?.locations || []} xKey="name" yKey="count" />
          </Card>
          <Card title={`Engineer Rating · ${data?.averageRating ?? "—"} / 5`}>
            <AnalyticsChart type="donut" data={data?.ratings || []} xKey="name" yKey="count" />
          </Card>
          <Card title="Airline Feedback">
            <AnalyticsChart type="bar" data={data?.airlines || []} xKey="name" yKey="count" />
          </Card>
          <Card title="Technical Trend">
            <AnalyticsChart type="line" data={data?.trend || []} xKey="date" yKey="count" />
          </Card>
          <Card title="Problem Resolution Rate">
            <div className="grid grid-cols-3 gap-3 pt-6">
              <Metric label="Resolved" value={`${data?.resolution?.resolved ?? 0}%`} />
              <Metric label="Partially" value={`${data?.resolution?.partial ?? 0}%`} />
              <Metric label="Not resolved" value={`${data?.resolution?.notResolved ?? 0}%`} />
            </div>
          </Card>
        </div>
      </section>
      </div>

      <section className="mt-8">
        <div className="no-print mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">{t.nav.reports}</h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 rounded-lg bg-navy px-4 text-white"
          >
            Print / PDF
          </button>
        </div>
        <div className="space-y-4">
          {overall ? <FeedbackReport report={overall} locale={locale} /> : null}
          {months.map((report) => (
            <FeedbackReport key={report.month} report={report} locale={locale} />
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function EngineerRatings({
  engineers,
  locale,
}: {
  engineers: {
    _id: string;
    name: string;
    isActive: boolean;
    averageRating: number;
    totalEvaluations: number;
  }[];
  locale: "mn" | "en";
}) {
  const active = engineers.filter((item) => item.isActive);
  const title = locale === "en" ? "Engineer ratings" : "Инженерүүдийн үнэлгээ";
  const countLabel = locale === "en" ? "reviews" : "үнэлгээ";

  return (
    <section className="mt-4 rounded-[16px] border border-border bg-white px-3 py-3">
      <h2 className="mb-2 text-sm font-semibold text-navy">{title}</h2>
      {active.length === 0 ? (
        <p className="text-xs text-muted-foreground">—</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {active.map((item) => (
            <Link
              key={item._id}
              href="/admin/engineers"
              className="rounded-xl bg-nubia-light px-2.5 py-2"
            >
              <div className="truncate text-xs font-medium text-navy">{item.name}</div>
              <div className="mt-0.5 text-sm font-semibold text-navy">
                {item.averageRating}
                <span className="text-[11px] font-normal text-muted-foreground"> / 5</span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((step) => {
                  const fill = Math.max(0, Math.min(1, item.averageRating - (step - 1)));
                  return (
                    <span key={step} className="h-1 flex-1 overflow-hidden rounded-full bg-white">
                      <span
                        className="block h-full bg-primary"
                        style={{ width: `${fill * 100}%` }}
                      />
                    </span>
                  );
                })}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {item.totalEvaluations} {countLabel}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <h3 className="mb-3 font-semibold text-navy">{title}</h3>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-nubia-light p-4 text-center">
      <div className="text-2xl font-semibold text-navy">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

