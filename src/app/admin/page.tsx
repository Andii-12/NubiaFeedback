"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatsCard } from "@/components/admin/StatsCard";
import { FeedbackTable } from "@/components/admin/FeedbackTable";
import type { FeedbackDTO } from "@/types";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    today: number;
    todayChange: number;
    issues: number;
    issuesChange: number;
    rating: number;
    ratingChange: number;
    critical: number;
    criticalChange: number;
    latest: {
      _id: string;
      requestId: string;
      time: string;
      date: string;
      airlineName?: string;
      locationName?: string;
      locationType: "checkin" | "gate";
      devices: FeedbackDTO["devices"];
      status: string;
      rating: number;
      resolved: string;
    }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics?range=this_month")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) => setData(json?.overview || null))
      .catch(() => setData(null));
  }, []);

  const latest: FeedbackDTO[] =
    data?.latest.map((item) => ({
      _id: item._id,
      requestId: item.requestId,
      airlineId: "",
      airlineName: item.airlineName,
      locationId: "",
      locationName: item.locationName,
      locationType: item.locationType,
      date: item.date,
      time: item.time,
      shift: "morning",
      devices: item.devices,
      technicalAnswers: {
        deviceStatus: item.status as FeedbackDTO["technicalAnswers"]["deviceStatus"],
        impactLevel: "low",
      },
      engineerAnswers: {
        responseSpeed: "fast",
        resolutionSpeed: "yes",
        fullyResolved: item.resolved as FeedbackDTO["engineerAnswers"]["fullyResolved"],
        communication: "good",
        explanationQuality: "clear",
      },
      engineerRating: item.rating,
      adminNotes: [],
      createdAt: "",
      updatedAt: "",
    })) || [];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Өнөөдрийн хариулт"
          value={data?.today ?? "—"}
          change={data?.todayChange}
          hint="өчигдөртэй харьцуулахад"
        />
        <StatsCard
          label="Техникийн асуудал"
          value={data?.issues ?? "—"}
          change={data?.issuesChange}
          hint="normal биш төхөөрөмж"
        />
        <StatsCard
          label="Инженерийн дундаж үнэлгээ"
          value={data ? `${data.rating} / 5` : "—"}
          change={data?.ratingChange}
        />
        <StatsCard
          label="Critical Issues"
          value={data?.critical ?? "—"}
          change={data?.criticalChange}
        />
      </div>
      <div className="mt-6 rounded-[16px] border border-border bg-white p-4">
        <h2 className="mb-3 text-base font-semibold text-navy">Latest responses</h2>
        <FeedbackTable items={latest} />
      </div>
    </AdminShell>
  );
}
