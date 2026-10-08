"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <TooltipProvider>
          {children}
          <Toaster theme="light" position="top-center" />
        </TooltipProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
