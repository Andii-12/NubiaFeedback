"use client";

import { MonitorSmartphone, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationDTO, LocationType } from "@/types";

export function LocationSelector({
  locationType,
  onTypeChange,
  locations,
  locationId,
  onLocationChange,
}: {
  locationType: LocationType | "";
  onTypeChange: (type: LocationType) => void;
  locations: LocationDTO[];
  locationId: string;
  onLocationChange: (id: string) => void;
}) {
  const filtered = locations.filter((l) =>
    locationType ? l.type === locationType : false
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTypeChange("checkin")}
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
          onClick={() => onTypeChange("gate")}
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

      {locationType ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-navy">
            {locationType === "checkin" ? "Check-in ширээ" : "Gate"}
          </span>
          <select
            className="h-12 w-full rounded-[14px] border-2 border-border bg-white px-3 text-base text-navy outline-none focus:border-primary"
            value={locationId}
            onChange={(e) => onLocationChange(e.target.value)}
          >
            <option value="">Сонгоно уу</option>
            {filtered.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
