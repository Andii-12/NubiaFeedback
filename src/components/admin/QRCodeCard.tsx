"use client";

import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import type { LocationDTO } from "@/types";
import { labels } from "@/lib/labels";
import Link from "next/link";

export function QRCodeCard({
  location,
  baseUrl,
}: {
  location: LocationDTO;
  baseUrl: string;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const url = `${baseUrl}/feedback?location=${encodeURIComponent(
    location.qrIdentifier
  )}&type=${location.type}`;

  function download() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `nubia-qr-${location.qrIdentifier}.png`;
    a.click();
  }

  return (
    <div className="rounded-[16px] border border-border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="font-semibold text-navy">{location.name}</div>
        <div className="text-xs text-muted-foreground">
          {labels.locationType(location.type)} · {location.code}
        </div>
      </div>
      <div className="flex justify-center rounded-[14px] bg-nubia-light p-3">
        <QRCodeSVG value={url} size={140} />
      </div>
      <div ref={canvasRef} className="hidden">
        <QRCodeCanvas value={url} size={512} includeMargin />
      </div>
      <p className="mt-3 truncate text-xs text-muted-foreground">{url}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={download}
          className="h-9 rounded-lg border border-border text-sm font-medium"
        >
          Download PNG
        </button>
        <Link
          href={`/admin/qr-codes/poster/${location._id}`}
          className="grid h-9 place-items-center rounded-lg bg-primary text-sm font-medium text-white"
        >
          Print
        </Link>
      </div>
    </div>
  );
}
