"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { LocationDTO } from "@/types";

export default function LocationsPage() {
  const [items, setItems] = useState<LocationDTO[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<"checkin" | "gate">("checkin");

  async function load() {
    const res = await fetch("/api/admin/locations");
    const data = await res.json();
    setItems(data.locations || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const res = await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code, type, qrIdentifier: code }),
    });
    if (!res.ok) return toast.error("Нэмэхэд алдаа гарлаа");
    setName("");
    setCode("");
    load();
  }

  async function patch(id: string, body: Partial<LocationDTO>) {
    await fetch(`/api/admin/locations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  return (
    <AdminShell title="Locations">
      <div className="mb-4 grid gap-2 rounded-[16px] border bg-white p-4 md:grid-cols-4">
        <input
          className="h-10 rounded-lg border px-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="h-10 rounded-lg border px-3"
          placeholder="Code / QR"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <select
          className="h-10 rounded-lg border px-3"
          value={type}
          onChange={(e) => setType(e.target.value as "checkin" | "gate")}
        >
          <option value="checkin">Check-in</option>
          <option value="gate">Gate</option>
        </select>
        <button type="button" onClick={create} className="h-10 rounded-lg bg-primary text-white">
          Add location
        </button>
      </div>
      <div className="overflow-hidden rounded-[16px] border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-nubia-light text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">QR</th>
              <th className="p-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.code}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.qrIdentifier}</td>
                <td className="p-3">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(checked) =>
                      patch(item._id, { isActive: Boolean(checked) })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
