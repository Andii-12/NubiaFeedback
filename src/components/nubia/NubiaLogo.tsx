import Image from "next/image";
import { cn } from "@/lib/utils";

export function NubiaLogo({
  className,
  wordmark = true,
  inverted = false,
  size = "md",
}: {
  className?: string;
  wordmark?: boolean;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const height =
    size === "lg" ? "h-16" : size === "sm" ? "h-8" : "h-10";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="overflow-hidden rounded-xl bg-white">
        <Image
          src="/Logo.png"
          alt="NUBIA"
          width={220}
          height={72}
          className={cn("w-auto object-contain object-left", height)}
          priority
        />
      </div>
      {wordmark ? (
        <div
          className="text-[10px] font-medium tracking-[0.14em] uppercase"
          style={{ color: inverted ? "rgba(255,255,255,0.75)" : "#5B6B82" }}
        >
          AIS Feedback
        </div>
      ) : null}
    </div>
  );
}
