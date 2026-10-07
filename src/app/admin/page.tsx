"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatsCard } from "@/components/admin/StatsCard";

export default function AdminDashboardPage() {
  const [onDuty, setOnDuty] = useState<{
    today: string;
    names: string[];
    expired: boolean;
  } | null>(null);
  const [data, setData] = useState<{
    total: number;
    totalChange: number;
    today: number;
    issues: number;
    issuesChange: number;
    rating: number;
    ratingChange: number;
    critical: number;
    criticalChange: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics?range=this_month")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) => setData(json?.overview || null))
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
  }, []);

  return (
    <AdminShell title="Dashboard">
      <div className="mb-4 rounded-[16px] border border-border bg-white px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Өнөөдрийн инженер {onDuty?.today ? `· ${onDuty.today}` : ""}
        </div>
        <div className="mt-1 text-lg font-semibold text-navy">
          {onDuty?.names.length
            ? onDuty.names.join(", ")
            : onDuty?.expired
              ? "Цагийн хуваарийн хугацаа дууссан"
              : "Хуваарьт инженер алга"}
        </div>
        {onDuty && !onDuty.names.length ? (
          <Link href="/admin/engineers" className="mt-2 inline-block text-sm font-medium text-primary">
            Add timesheet
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Энэ сарын хариулт"
          value={data?.total ?? "—"}
          change={data?.totalChange}
          hint={data ? `өнөөдөр ${data.today} · өмнөх үетэй` : "өмнөх үетэй"}
        />
        <StatsCard
          label="Техникийн асуудал"
          value={data?.issues ?? "—"}
          change={data?.issuesChange}
          hint="хэвийн бус төхөөрөмж"
        />
        <StatsCard
          label="Инженерийн дундаж үнэлгээ"
          value={data ? `${data.rating} / 5` : "—"}
          change={data?.ratingChange}
        />
        <StatsCard
          label="Ноцтой асуудал"
          value={data?.critical ?? "—"}
          change={data?.criticalChange}
        />
      </div>
    </AdminShell>
  );
}
