"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";

type EngineerRow = {
  _id: string;
  name: string;
  email?: string;
  isActive: boolean;
  averageRating: number;
  totalEvaluations: number;
  resolvedPercent: number;
  responseRating: number;
};

type DutyDay = {
  date: string;
  engineers: { name: string; shift: string }[];
};

export default function EngineersPage() {
  const [items, setItems] = useState<EngineerRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [days, setDays] = useState<DutyDay[]>([]);
  const [today, setToday] = useState("");
  const [todayEngineers, setTodayEngineers] = useState<DutyDay["engineers"]>([]);
  const [expired, setExpired] = useState(false);
  const [scheduleLoaded, setScheduleLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/engineers");
    const data = await res.json();
    setItems(data.engineers || []);
  }

  async function loadSchedule() {
    const res = await fetch("/api/admin/engineers/schedule");
    const data = await res.json();
    setDays(data.days || []);
    setToday(data.today || "");
    setTodayEngineers(data.todayEngineers || []);
    setExpired(Boolean(data.expired));
    setScheduleLoaded(true);
  }

  useEffect(() => {
    load();
    loadSchedule();
  }, []);

  async function uploadSchedule() {
    if (!file) {
      toast.error("Excel файл сонгоно уу.");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/engineers/schedule", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Хуваарь оруулж чадсангүй.");
        return;
      }
      toast.success(`${data.dates} өдөр, ${data.saved} ээлж хадгаллаа.`);
      setFile(null);
      setFileKey((key) => key + 1);
      loadSchedule();
    } finally {
      setUploading(false);
    }
  }

  async function clearSchedule() {
    if (!confirm("Энэ сарын цагийн хуваарийг арилгах уу?")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin/engineers/schedule", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Арилгаж чадсангүй.");
        return;
      }
      toast.success("Цагийн хуваарь арилгалаа.");
      loadSchedule();
    } finally {
      setClearing(false);
    }
  }

  async function create() {
    const res = await fetch("/api/admin/engineers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) {
      toast.error("Нэмэх эрхгүй эсвэл алдаа гарлаа");
      return;
    }
    setName("");
    setEmail("");
    load();
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/engineers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  async function remove(item: EngineerRow) {
    if (!confirm(`${item.name} устгах уу?`)) return;
    const res = await fetch(`/api/admin/engineers/${item._id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Устгах эрхгүй эсвэл алдаа гарлаа");
      return;
    }
    toast.success("Устгалаа");
    load();
  }

  return (
    <AdminShell title="Engineers">
      <div className="mb-4 rounded-[16px] border border-border bg-white p-4">
        <h2 className="text-base font-semibold text-navy">Ээлжийн хуваарь</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Эхний баганад Engineers, толгойд 10.01 маягийн огноо, гарсан өдөрт 24
          гэж тэмдэглэсэн цагийн хуваарь оруулна.
        </p>
        {days.length ? (
          <div className="mt-3 rounded-xl bg-nubia-light px-3 py-2 text-sm text-navy">
            <span className="text-muted-foreground">Өнөөдөр {today || "—"}: </span>
            <span className="font-semibold">
              {todayEngineers.length
                ? todayEngineers.map((engineer) => engineer.name).join(", ")
                : "Өнөөдөр гарсан инженер алга"}
            </span>
          </div>
        ) : scheduleLoaded ? (
          <div className="mt-3 rounded-xl border border-dashed border-primary/40 bg-nubia-light/50 px-4 py-5 text-center">
            <p className="font-medium text-navy">
              {expired
                ? "Энэ сарын цагийн хуваарийн хугацаа дууссан."
                : "Цагийн хуваарь алга."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Шинэ сарын цагийн хуваарь оруулна уу.
            </p>
          </div>
        ) : null}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            key={fileKey}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="h-10 flex-1 rounded-lg border px-3 py-1.5 text-sm"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <button
            type="button"
            onClick={uploadSchedule}
            disabled={uploading}
            className="h-10 rounded-lg bg-primary px-4 text-white disabled:opacity-60"
          >
            {uploading
              ? "Оруулж байна..."
              : scheduleLoaded && !days.length
                ? "Add timesheet"
                : "Хуваарь оруулах"}
          </button>
          {days.length ? (
            <button
              type="button"
              onClick={clearSchedule}
              disabled={clearing || uploading}
              className="h-10 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {clearing ? "Арилгаж байна..." : "Clear timesheet"}
            </button>
          ) : null}
        </div>
        {days.length ? (
          <div className="mt-4 max-h-72 overflow-auto rounded-[14px] border border-border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-nubia-light text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Огноо</th>
                  <th className="px-3 py-2 font-medium">Гарсан инженер</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day.date} className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-navy">{day.date}</td>
                    <td className="px-3 py-2 text-navy">
                      {day.engineers
                        .map((engineer) =>
                          engineer.shift
                            ? `${engineer.name} (${engineer.shift})`
                            : engineer.name
                        )
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <div className="mb-4 grid gap-2 rounded-[16px] border border-border bg-white p-4 md:grid-cols-3">
        <input
          className="h-10 rounded-lg border px-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="h-10 rounded-lg border px-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          onClick={create}
          className="h-10 rounded-lg bg-primary text-white"
        >
          Add engineer
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-[16px] border border-border bg-white p-5"
          >
            <div className="text-lg font-semibold text-navy">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.email}</div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Average Rating</span>
                <span className="font-semibold">{item.averageRating} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>Total Evaluations</span>
                <span className="font-semibold">{item.totalEvaluations}</span>
              </div>
              <div className="flex justify-between">
                <span>Resolved</span>
                <span className="font-semibold">{item.resolvedPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span>Fast response</span>
                <span className="font-semibold">{item.responseRating}%</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggle(item._id, item.isActive)}
                className="text-sm text-primary"
              >
                {item.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
