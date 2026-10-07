"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { labels } from "@/lib/labels";
import type { EngineerDTO, FeedbackDTO } from "@/types";
import { toast } from "sonner";

export default function ResponseDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<FeedbackDTO | null>(null);
  const [engineers, setEngineers] = useState<EngineerDTO[]>([]);
  const [note, setNote] = useState("");
  const [engineerId, setEngineerId] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/feedback/${params.id}`);
    const data = await res.json();
    setItem(data.item);
    setEngineerId(data.item?.engineerId || "");
  }

  useEffect(() => {
    load();
    fetch("/api/admin/engineers")
      .then((r) => r.json())
      .then((d) => setEngineers(d.engineers || []));
  }, [params.id]);

  const selected = engineers.find((eng) => eng._id === engineerId);

  async function sendMail() {
    if (!engineerId || !selected?.email) {
      toast.error("Ажлын имэйлтэй инженер сонгоно уу.");
      return;
    }
    if (!note.trim()) {
      toast.error("Илгээх тэмдэглэл бичнэ үү.");
      return;
    }
    setSending(true);
    const res = await fetch(`/api/admin/feedback/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, engineerId }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      toast.error(data.error || "Имэйл илгээж чадсангүй");
      return;
    }
    setNote("");
    toast.success(`${selected.email} руу илгээлээ`);
    load();
  }

  if (!item) {
    return (
      <AdminShell title="Response">
        <div>Уншиж байна...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={item.requestId}>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4 rounded-[16px] border border-border bg-white p-5">
          <Section title="Үндсэн мэдээлэл">
            <Row label="Airline" value={item.airlineName || ""} />
            <Row
              label="Location"
              value={`${labels.locationTypes(item.locationTypes?.length ? item.locationTypes : [item.locationType])} · ${item.locationName || ""}`}
            />
            <Row label="Date / Time" value={`${item.date} ${item.time}`} />
            <Row
              label="Өдрийн инженер"
              value={item.dutyEngineers?.length ? item.dutyEngineers.join(", ") : "—"}
            />
            <Row label="Shift" value={labels.shift(item.shift)} />
            <Row label="Request ID" value={item.requestId} />
          </Section>
          <Section title="Technical questions">
            <Row label="Devices" value={labels.devices(item.devices)} />
            <Row
              label="Device status"
              value={labels.deviceReport(
                item.technicalAnswers.deviceAnswers,
                item.technicalAnswers.deviceStatus
              )}
            />
            {item.technicalAnswers.deviceAnswers?.length ? null : (
              <>
                <Row
                  label="Printing"
                  value={labels.printing(item.technicalAnswers.printingStatus)}
                />
                <Row
                  label="OCR / BGR"
                  value={labels.scanning(item.technicalAnswers.scanningStatus)}
                />
                <Row
                  label="WS / Network"
                  value={labels.workstation(
                    item.technicalAnswers.workstationStatus
                  )}
                />
              </>
            )}
            <Row
              label="Impact"
              value={`${labels.impact(item.technicalAnswers.impactLevel)} (${labels.impactSeverity(item.technicalAnswers.impactLevel)})`}
            />
          </Section>
          <Section title="Engineer evaluation">
            <Row
              label="Response speed"
              value={labels.responseSpeed(item.engineerAnswers.responseSpeed)}
            />
            <Row
              label="Resolved quickly"
              value={labels.resolutionSpeed(item.engineerAnswers.resolutionSpeed)}
            />
            <Row
              label="Resolved quickly note"
              value={item.engineerAnswers.resolutionNote || "—"}
            />
            <Row
              label="Fully resolved"
              value={labels.fullyResolved(item.engineerAnswers.fullyResolved)}
            />
            <Row
              label="Fully resolved note"
              value={item.engineerAnswers.resolvedNote || "—"}
            />
            <Row
              label="Communication"
              value={labels.communication(item.engineerAnswers.communication)}
            />
            <Row
              label="Communication note"
              value={item.engineerAnswers.communicationNote || "—"}
            />
            <Row
              label="Explanation"
              value={labels.explanation(item.engineerAnswers.explanationQuality)}
            />
            <Row label="Rating" value={`${item.engineerRating} / 5`} />
          </Section>
          <Section title="Comment">
            <p className="text-navy">{item.comment || "—"}</p>
          </Section>
        </div>
        <div className="space-y-4">
          <div className="rounded-[16px] border border-border bg-white p-5">
            <h3 className="mb-3 font-semibold text-navy">Assign engineer</h3>
            <select
              className="h-10 w-full rounded-lg border px-2"
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
            >
              <option value="">Инженер сонгох</option>
              {engineers.map((eng) => (
                <option key={eng._id} value={eng._id}>
                  {eng.name}
                  {eng.email ? ` · ${eng.email}` : " · имэйл алга"}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              {selected?.email
                ? `Ажлын имэйл: ${selected.email}`
                : "Ажлын имэйлтэй инженер сонгоно уу."}
            </p>
          </div>
          <div className="rounded-[16px] border border-border bg-white p-5">
            <h3 className="mb-3 font-semibold text-navy">Admin notes</h3>
            <div className="mb-3 space-y-2">
              {item.adminNotes.map((n, i) => (
                <div key={i} className="rounded-lg bg-nubia-light p-3 text-sm">
                  <div className="font-medium text-navy">{n.text}</div>
                  <div className="text-xs text-muted-foreground">
                    {n.author} · {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <textarea
              className="w-full rounded-lg border p-2 text-sm"
              rows={4}
              placeholder="Инженерт илгээх тэмдэглэл"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              type="button"
              onClick={sendMail}
              disabled={sending || !selected?.email || !note.trim()}
              className="mt-3 h-10 w-full rounded-lg bg-primary text-white disabled:opacity-60"
            >
              {sending ? "Илгээж байна..." : "Send mail"}
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-navy">{value}</span>
    </div>
  );
}
