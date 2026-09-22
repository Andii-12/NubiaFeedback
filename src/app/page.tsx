import Link from "next/link";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-nubia-light/30">
      <header className="mx-auto flex max-w-3xl items-center px-4 py-6">
        <div className="transition-transform hover:scale-105">
          <NubiaLogo />
        </div>
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
          <div className="mt-10">
            <Link
              href="/feedback"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-20 w-full max-w-xl rounded-[18px] text-2xl font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
              )}
            >
              Санал өгөх
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
