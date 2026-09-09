import Link from "next/link";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QrCode, ShieldCheck, Timer, Wrench } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <NubiaLogo />
        <Link
          href="/admin/login"
          className="text-sm font-medium text-muted-foreground hover:text-navy"
        >
          AIS Admin
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-nubia-light px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            New Ulaanbaatar International Airport
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-navy md:text-5xl">
            Airline Staff Feedback Platform
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Check-in болон Gate ажилтнууд техникийн төхөөрөмж, AIS инженерийн
            үйлчилгээний талаар 1 минутын дотор санал өгнө.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/feedback"
              className={cn(buttonVariants(), "h-12 rounded-[14px] px-6 text-base")}
            >
              Санал өгөх
            </Link>
            <Link
              href="/admin/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-[14px] px-6 text-base"
              )}
            >
              Dashboard
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Timer, label: "30–60 сек" },
              { icon: QrCode, label: "QR-аар нээнэ" },
              { icon: Wrench, label: "OCR · CUPPS · DCS" },
              { icon: ShieldCheck, label: "AIS operations" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[16px] border border-border bg-white p-3"
              >
                <item.icon className="mb-2 size-5 text-primary" />
                <div className="text-sm font-medium text-navy">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
