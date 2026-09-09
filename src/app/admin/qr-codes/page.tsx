"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { QRCodeCard } from "@/components/admin/QRCodeCard";
import type { LocationDTO } from "@/types";

export default function QRCodesPage() {
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");
  const [type, setType] = useState("all");

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations || []));
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setBaseUrl(d.settings?.publicUrl || window.location.origin));
  }, []);

  const filtered = locations.filter((l) =>
    type === "all" ? true : l.type === type
  );

  return (
    <AdminShell title="QR Codes">
      <div className="mb-4 flex gap-2">
        {["all", "checkin", "gate"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              type === value ? "bg-primary text-white" : "bg-nubia-light"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((location) => (
          <QRCodeCard key={location._id} location={location} baseUrl={baseUrl} />
        ))}
      </div>
    </AdminShell>
  );
}
