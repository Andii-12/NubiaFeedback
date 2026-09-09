"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
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
      setError("И-мэйл эсвэл нууц үг буруу байна.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden bg-navy p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <NubiaLogo inverted />
        <div>
          <h1 className="text-4xl font-semibold leading-tight">
            NUBIA AIS
            <br />
            Operations Console
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Check-in, Gate, OCR, CUPPS/DCS төхөөрөмж болон инженерүүдийн
            үйлчилгээний чанарыг нэг дороос хянана.
          </p>
        </div>
        <div className="text-sm text-white/50">People • Technology • Better Journeys</div>
      </div>
      <div className="flex items-center justify-center bg-surface p-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-[18px] border border-border bg-white p-6 shadow-sm"
        >
          <div className="mb-6 lg:hidden">
            <NubiaLogo />
          </div>
          <h2 className="text-xl font-semibold text-navy">Admin login</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Зөвхөн AIS / Admin хэрэглэгчид нэвтэрнэ.
          </p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
