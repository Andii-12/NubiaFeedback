"use client";

import { MonitorSmartphone, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationDTO, LocationType } from "@/types";

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-10 rounded-[12px] border-2 px-3 text-sm font-semibold transition-colors",
        selected
          ? "border-primary bg-nubia-light text-navy"
          : "border-border bg-white text-navy hover:border-primary/40"
      )}
    >
      {children}
    </button>
  );
}

export function LocationSelector({
  locationTypes,
  onChange,
  locations,
  locationIds,
}: {
  locationTypes: LocationType[];
  onChange: (next: { locationTypes: LocationType[]; locationIds: string[] }) => void;
  locations: LocationDTO[];
  locationIds: string[];
}) {
  const locationType = locationTypes.includes("checkin")
    ? "checkin"
    : locationTypes.includes("gate")
      ? "gate"
      : "";
  const selectedId =
    locations.find(
      (item) => item.type === locationType && locationIds.includes(item._id)
    )?._id || "";

  const checkins = locations.filter((item) => item.type === "checkin");
  const gates = locations.filter((item) => item.type === "gate");
  const checkinGroups = [
    { label: "A ширээ", items: checkins.filter((item) => item.code.startsWith("A")) },
    { label: "C ширээ", items: checkins.filter((item) => item.code.startsWith("C")) },
    { label: "D ширээ", items: checkins.filter((item) => item.code.startsWith("D")) },
    {
      label: "Бусад",
      items: checkins.filter((item) => !/^[ACD]/.test(item.code)),
    },
  ].filter((group) => group.items.length > 0);

  function chooseType(type: LocationType) {
    if (locationType === type) return;
    onChange({ locationTypes: [type], locationIds: [] });
  }

  function chooseLocation(id: string) {
    if (!locationType) return;
    onChange({ locationTypes: [locationType], locationIds: [id] });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={locationType === "checkin"}
          onClick={() => chooseType("checkin")}
          className={cn(
            "flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-[16px] border-2 p-4",
            locationType === "checkin"
              ? "border-primary bg-nubia-light"
              : "border-border bg-white"
          )}
        >
          <MonitorSmartphone className="size-8 text-primary" />
          <span className="text-base font-semibold text-navy">Check-in</span>
        </button>
        <button
          type="button"
          aria-pressed={locationType === "gate"}
          onClick={() => chooseType("gate")}
          className={cn(
            "flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-[16px] border-2 p-4",
            locationType === "gate"
              ? "border-primary bg-nubia-light"
              : "border-border bg-white"
          )}
        >
          <Plane className="size-8 text-primary" />
          <span className="text-base font-semibold text-navy">Gate</span>
        </button>
      </div>

      {locationType === "checkin" ? (
        <div className="space-y-3">
          <span className="text-sm font-medium text-navy">Check-in ширээ</span>
          {checkinGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((location) => (
                  <Chip
                    key={location._id}
                    selected={selectedId === location._id}
                    onClick={() => chooseLocation(location._id)}
                  >
                    {location.name}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {locationType === "gate" ? (
        <div className="space-y-2">
          <span className="text-sm font-medium text-navy">Gate</span>
          <div className="flex flex-wrap gap-2">
            {gates.map((location) => (
              <Chip
                key={location._id}
                selected={selectedId === location._id}
                onClick={() => chooseLocation(location._id)}
              >
                {location.name}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
