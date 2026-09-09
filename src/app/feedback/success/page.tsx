import { SuccessCard } from "@/components/nubia/SuccessCard";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const id = String(params.id || "NUB-2026-0000");
  const airline = String(params.airline || "—");
  const location = String(params.location || "—");
  const date = String(params.date || new Date().toISOString().slice(0, 10));

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="mx-auto max-w-md">
        <SuccessCard
          requestId={id}
          airline={airline}
          location={location}
          date={date}
        />
      </div>
    </div>
  );
}
