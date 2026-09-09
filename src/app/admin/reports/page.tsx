"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type Report = {
  month?: string;
  total: number;
  mostProblematicDevice: string;
  mostProblematicLocation: string;
  bestEngineer: string;
  averageEngineerScore: number;
  topIssueCategory: string;
  resolvedPercent: number;
};

export default function ReportsPage() {
  const [overall, setOverall] = useState<Report | null>(null);
  const [months, setMonths] = useState<Report[]>([]);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => {
        setOverall(d.overall || null);
        setMonths(d.months || []);
      });
  }, []);

  return (
    <AdminShell title="Reports">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Бүх сарын тайлан нэг хуудсанд
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="h-10 rounded-lg bg-navy px-4 text-white"
        >
          Print / PDF
        </button>
      </div>

      {overall ? (
        <ReportCard title="Overall report" report={overall} highlight />
      ) : null}

      <div className="mt-4 space-y-4">
        {months.map((report) => (
          <ReportCard
            key={report.month}
            title={`Monthly report · ${report.month}`}
            report={report}
          />
        ))}
      </div>
    </AdminShell>
  );
}

function ReportCard({
  title,
  report,
  highlight = false,
}: {
  title: string;
  report: Report;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[16px] border bg-white p-6 print:border-0 print:shadow-none ${
        highlight ? "ring-1 ring-primary/20" : ""
      }`}
    >
      <h2 className="text-xl font-semibold text-navy">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total responses" value={report.total} />
        <Stat label="Most problematic device" value={report.mostProblematicDevice} />
        <Stat label="Most problematic location" value={report.mostProblematicLocation} />
        <Stat label="Best engineer rating" value={report.bestEngineer} />
        <Stat label="Average engineer score" value={`${report.averageEngineerScore} / 5`} />
        <Stat label="Top issue category" value={report.topIssueCategory} />
        <Stat label="Resolved percentage" value={`${report.resolvedPercent}%`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[14px] bg-nubia-light p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold text-navy">{value}</div>
    </div>
  );
}
