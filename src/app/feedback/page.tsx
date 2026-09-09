"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FeedbackFormProvider } from "@/components/feedback/FeedbackFormProvider";
import { FeedbackWizard } from "@/components/feedback/FeedbackWizard";
import type { FeedbackFormState, LocationType } from "@/types";
import { Suspense } from "react";

function FeedbackInner() {
  const params = useSearchParams();
  const [prefill, setPrefill] = useState<Partial<FeedbackFormState>>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const location = params.get("location");
    const type = params.get("type") as LocationType | null;
    async function load() {
      if (location) {
        const res = await fetch(
          `/api/locations?qr=${encodeURIComponent(location)}${type ? `&type=${type}` : ""}`
        );
        const data = await res.json();
        const loc = data.location;
        if (loc) {
          setPrefill({
            locationId: loc._id,
            locationType: loc.type,
          });
        } else if (type) {
          setPrefill({ locationType: type });
        }
      }
      setReady(true);
    }
    load();
  }, [params]);

  if (!ready) {
    return (
      <div className="py-20 text-center text-muted-foreground">Уншиж байна...</div>
    );
  }

  return (
    <FeedbackFormProvider prefill={prefill}>
      <FeedbackWizard />
    </FeedbackFormProvider>
  );
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <Suspense fallback={<div className="py-20 text-center">Уншиж байна...</div>}>
        <FeedbackInner />
      </Suspense>
    </div>
  );
}
