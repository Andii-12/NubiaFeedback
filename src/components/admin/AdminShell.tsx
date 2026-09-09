"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[260px] p-0">
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader title={title} onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
