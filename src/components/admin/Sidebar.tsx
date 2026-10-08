"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Users,
  Plane,
  MapPin,
  QrCode,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useI18n } from "@/components/i18n/LocaleProvider";

const ICONS = [
  { href: "/admin", key: "dashboard", icon: LayoutDashboard },
  { href: "/admin/responses", key: "responses", icon: Inbox },
  { href: "/admin/analytics", key: "analytics", icon: BarChart3 },
  { href: "/admin/engineers", key: "engineers", icon: Users },
  { href: "/admin/airlines", key: "airlines", icon: Plane },
  { href: "/admin/locations", key: "locations", icon: MapPin },
  { href: "/admin/qr-codes", key: "qr", icon: QrCode },
  { href: "/admin/reports", key: "reports", icon: FileText },
  { href: "/admin/settings", key: "settings", icon: Settings },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="flex h-full w-[260px] flex-col bg-navy text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <NubiaLogo inverted />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {ICONS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/12 text-white"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon className="size-4.5" />
              {t.nav[item.key]}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white"
        >
          <LogOut className="size-4.5" />
          {t.nav.logout}
        </button>
      </div>
    </aside>
  );
}
