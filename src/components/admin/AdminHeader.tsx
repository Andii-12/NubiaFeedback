"use client";

import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AdminHeader({
  title,
  onMenu,
}: {
  title: string;
  onMenu?: () => void;
}) {
  const { data } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenu}
        >
          <Menu className="size-4" />
        </Button>
        <h1 className="text-lg font-semibold text-navy">{title}</h1>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-navy">
          {data?.user?.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {data?.user?.role}
        </div>
      </div>
    </header>
  );
}
