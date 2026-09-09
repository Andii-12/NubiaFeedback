import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NUBIA Airline Staff Feedback",
  description:
    "New Ulaanbaatar International Airport check-in and gate staff technical feedback platform.",
  icons: {
    icon: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
