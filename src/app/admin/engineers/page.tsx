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

export default function EngineersPage() {
  const [items, setItems] = useState<EngineerRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    const res = await fetch("/api/admin/engineers");
    const data = await res.json();
    setItems(data.engineers || []);
  }

  useEffect(() => {
    load();
  }, []);

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
