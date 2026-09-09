"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    devices: { name: string; count: number }[];
    locations: { name: string; count: number }[];
    airlines: { name: string; count: number }[];
    ratings: { name: string; count: number }[];
    trend: { date: string; count: number }[];
    averageRating: number;
    resolution: { resolved: number; partial: number; notResolved: number };
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics?range=this_month")
      .then(async (r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <AdminShell title="Analytics">
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Device Issue Count">
          <AnalyticsChart type="bar" data={data?.devices || []} xKey="name" yKey="count" />
        </Card>
        <Card title="Issues by Location">
          <AnalyticsChart type="bar" data={data?.locations || []} xKey="name" yKey="count" />
        </Card>
        <Card title={`Engineer Rating · ${data?.averageRating ?? "—"} / 5`}>
          <AnalyticsChart
            type="donut"
            data={data?.ratings || []}
            xKey="name"
            yKey="count"
          />
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
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <h2 className="mb-3 font-semibold text-navy">{title}</h2>
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
