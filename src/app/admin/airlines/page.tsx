"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { AirlineDTO } from "@/types";

export default function AirlinesPage() {
  const [items, setItems] = useState<AirlineDTO[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  async function load() {
    const res = await fetch("/api/admin/airlines");
    const data = await res.json();
    setItems(data.airlines || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const res = await fetch("/api/admin/airlines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code, logo: code }),
    });
    if (!res.ok) return toast.error("Нэмэхэд алдаа гарлаа");
    setName("");
    setCode("");
    load();
  }

  async function patch(id: string, body: Partial<AirlineDTO>) {
    await fetch(`/api/admin/airlines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function remove(item: AirlineDTO) {
    if (!confirm(`${item.name} устгах уу?`)) return;
    const res = await fetch(`/api/admin/airlines/${item._id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Устгах эрхгүй эсвэл алдаа гарлаа");
      return;
    }
    toast.success("Устгалаа");
    load();
  }

  return (
    <AdminShell title="Airlines">
      <div className="mb-4 grid gap-2 rounded-[16px] border bg-white p-4 md:grid-cols-3">
        <input
          className="h-10 rounded-lg border px-3"
          placeholder="Airline name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="h-10 rounded-lg border px-3"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="button" onClick={create} className="h-10 rounded-lg bg-primary text-white">
          Add airline
        </button>
      </div>
      <div className="overflow-hidden rounded-[16px] border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-nubia-light text-left">
            <tr>
              <th className="p-3">Airline</th>
              <th className="p-3">Code</th>
              <th className="p-3">Logo</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">
                  <input
                    defaultValue={item.name}
                    className="h-9 rounded border px-2"
                    onBlur={(e) =>
                      e.target.value !== item.name &&
                      patch(item._id, { name: e.target.value })
                    }
                  />
                </td>
                <td className="p-3 font-medium">{item.code}</td>
                <td className="p-3">
                  <span className="rounded-lg bg-navy px-2 py-1 text-xs text-white">
                    {item.logo || item.code}
                  </span>
                </td>
                <td className="p-3">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(checked) =>
                      patch(item._id, { isActive: Boolean(checked) })
                    }
                  />
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
