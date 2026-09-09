import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { NubiaLogo } from "@/components/nubia/NubiaLogo";
import { cn } from "@/lib/utils";

export function SuccessCard({
  requestId,
  airline,
  location,
  date,
}: {
  requestId: string;
  airline: string;
  location: string;
  date: string;
}) {
  return (
    <div className="rounded-[18px] border border-border bg-white p-6 text-center shadow-sm">
      <div className="mb-5 flex justify-center">
        <NubiaLogo />
      </div>
      <CheckCircle2 className="mx-auto size-16 text-emerald-600" />
      <h1 className="mt-4 text-2xl font-semibold text-navy">
        Амжилттай илгээгдлээ
      </h1>
      <p className="mt-2 text-muted-foreground">
        Таны хариулт бүртгэгдлээ. Баярлалаа.
      </p>
      <div className="mt-6 space-y-2 rounded-[14px] bg-nubia-light p-4 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Airline</span>
          <span className="font-medium text-navy">{airline}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location</span>
          <span className="font-medium text-navy">{location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium text-navy">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Request ID</span>
          <span className="font-semibold text-primary">#{requestId}</span>
        </div>
      </div>
      <div className="mt-6 grid gap-2">
        <Link href="/feedback" className={cn(buttonVariants(), "h-12 rounded-[14px] text-base")}>
          Шинэ form бөглөх
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-[14px] text-base")}
        >
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
