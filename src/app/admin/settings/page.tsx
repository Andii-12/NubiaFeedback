"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { toast } from "sonner";

export default function SettingsPage() {
  const [publicUrl, setPublicUrl] = useState("");
  const [organization, setOrganization] = useState("NUBIA AIS");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [users, setUsers] = useState<{ name: string; email: string; role: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setPublicUrl(d.settings?.publicUrl || "");
        setOrganization(d.settings?.organization || "NUBIA AIS");
        setUsers(d.users || []);
      });
  }, []);

  async function save() {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicUrl,
        organization,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Хадгалж чадсангүй");
      return;
    }
    toast.success("Settings saved");
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <AdminShell title="Settings">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[16px] border bg-white p-5">
          <h2 className="mb-4 font-semibold text-navy">Platform</h2>
          <label className="mb-3 block text-sm">
            Public URL for QR codes
            <input
              className="mt-1 h-10 w-full rounded-lg border px-3"
              value={publicUrl}
              onChange={(e) => setPublicUrl(e.target.value)}
            />
          </label>
          <label className="mb-3 block text-sm">
            Organization
            <input
              className="mt-1 h-10 w-full rounded-lg border px-3"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={save}
            className="h-10 rounded-lg bg-primary px-4 text-white"
          >
            Save
          </button>
        </div>
        <div className="rounded-[16px] border bg-white p-5">
          <h2 className="mb-4 font-semibold text-navy">Change password</h2>
          <input
            type="password"
            className="mb-3 h-10 w-full rounded-lg border px-3"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="mb-3 h-10 w-full rounded-lg border px-3"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={save}
            className="h-10 rounded-lg bg-navy px-4 text-white"
          >
            Update password
          </button>
        </div>
        <div className="rounded-[16px] border bg-white p-5 xl:col-span-2">
          <h2 className="mb-4 font-semibold text-navy">Users</h2>
          <div className="space-y-2 text-sm">
            {users.map((user) => (
              <div
                key={user.email}
                className="flex justify-between rounded-lg bg-nubia-light px-3 py-2"
              >
                <span>
                  {user.name} · {user.email}
                </span>
                <span className="font-medium">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
