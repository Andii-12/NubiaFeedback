"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { messagesFor, type Messages } from "@/lib/i18n/messages";
import { createLabels } from "@/lib/labels";
import type { Locale } from "@/lib/i18n/options";

const KEY = "nubia-locale";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("mn");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "mn") setLocaleState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "mn";
    if (ready) localStorage.setItem(KEY, locale);
  }, [locale, ready]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: messagesFor(locale),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) {
    return {
      locale: "mn" as Locale,
      setLocale: () => {},
      t: messagesFor("mn"),
    };
  }
  return value;
}

export function useLabels() {
  const { locale } = useI18n();
  return useMemo(() => createLabels(locale), [locale]);
}

export function LanguageSwitch({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const { locale, setLocale } = useI18n();
  const item = (active: boolean) =>
    tone === "dark"
      ? active
        ? "bg-white text-navy"
        : "text-white/70"
      : active
        ? "bg-primary text-white"
        : "text-navy";

  return (
    <div
      className={`inline-flex rounded-full p-0.5 text-xs font-semibold ${
        tone === "dark" ? "bg-white/10" : "border border-border bg-white"
      }`}
    >
      {(
        [
          ["mn", "МН"],
          ["en", "EN"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={`rounded-full px-2.5 py-1 ${item(locale === value)}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
