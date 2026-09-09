"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import type { LocationDTO } from "@/types";

export default function QRPosterPage() {
  const params = useParams<{ id: string }>();
  const [location, setLocation] = useState<LocationDTO | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.locations || []).find(
          (l: LocationDTO) => l._id === params.id
        );
        setLocation(found || null);
      });
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setBaseUrl(d.settings?.publicUrl || window.location.origin));
  }, [params.id]);

  if (!location) return <div className="p-8">Loading poster...</div>;

  const url = `${baseUrl}/feedback?location=${encodeURIComponent(
    location.qrIdentifier
  )}&type=${location.type}`;

  return (
    <div className="min-h-screen bg-white p-6 print:p-0">
      <div className="no-print mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Print A5 / A6
        </button>
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded-lg border px-4 py-2"
        >
          Back
        </button>
      </div>
      <div className="print-poster mx-auto flex min-h-[210mm] max-w-[148mm] flex-col items-center justify-between rounded-[24px] border border-border bg-white p-8 text-center shadow-sm">
        <NubiaLogo size="lg" />
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {location.name} · {location.type === "gate" ? "GATE" : "CHECK-IN"}
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-navy">
            Таны санал илүү сайн үйлчилгээг бүтээнэ
          </h1>
        </div>
        <div className="rounded-[20px] bg-nubia-light p-5">
          <QRCodeSVG value={url} size={220} />
        </div>
        <div>
          <div className="text-lg font-semibold tracking-[0.25em] text-primary">
            SCAN QR
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            1 минутын дотор бөглөж, өөрчлөлтөд хувь нэмэр оруулаарай.
          </p>
        </div>
        <div className="text-xs tracking-[0.18em] text-navy uppercase">
          People • Technology • Better Journeys
        </div>
      </div>
      <style>{`
        @page { size: A5; margin: 10mm; }
      `}</style>
    </div>
  );
}
