import Link from "next/link";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QrCode, ShieldCheck, Timer, Wrench } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-nubia-light/30">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
        <div className="transition-transform hover:scale-105">
          <NubiaLogo />
        </div>
        <Link
          href="/admin/login"
          className="rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-navy hover:shadow"
        >
          AIS Admin
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-4 inline-flex rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase border border-primary/20">
            New Ulaanbaatar International Airport
          </p>
          <h1 className="text-5xl font-bold leading-tight text-navy md:text-6xl bg-gradient-to-br from-navy to-primary bg-clip-text text-transparent">
            Airline Staff Feedback Platform
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Check-in болон Gate ажилтнууд техникийн төхөөрөмж, AIS инженерийн
            үйлчилгээний талаар 1 минутын дотор санал өгнө.
          </p>
          <div className="mt-8">
            <Link
              href="/feedback"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-[16px] px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
              )}
            >
              Санал өгөх
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Timer, label: "30–60 сек" },
              { icon: QrCode, label: "QR-аар нээнэ" },
              { icon: Wrench, label: "OCR · CUPPS · DCS" },
              { icon: ShieldCheck, label: "AIS operations" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="group rounded-[18px] border border-border/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 transition-colors group-hover:from-primary/20 group-hover:to-primary/10">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div className="text-sm font-semibold text-navy">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
