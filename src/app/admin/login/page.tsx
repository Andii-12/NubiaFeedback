"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitch, useI18n } from "@/components/i18n/LocaleProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("admin@nubia.airport");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(t.login.bad);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden bg-navy p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-start justify-between gap-4">
          <NubiaLogo inverted />
          <LanguageSwitch tone="dark" />
        </div>
        <div>
          <h1 className="whitespace-pre-line text-4xl font-semibold leading-tight">
            {t.login.title}
          </h1>
          <p className="mt-4 max-w-md text-white/70">{t.login.lead}</p>
        </div>
        <div className="text-sm text-white/50">People • Technology • Better Journeys</div>
      </div>
      <div className="flex items-center justify-center bg-surface p-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-[18px] border border-border bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <NubiaLogo />
            <LanguageSwitch />
          </div>
          <h2 className="text-xl font-semibold text-navy">{t.login.heading}</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">{t.login.hint}</p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t.login.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t.login.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? t.login.wait : t.login.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
