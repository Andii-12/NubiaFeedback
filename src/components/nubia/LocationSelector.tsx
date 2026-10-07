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
        "h-8 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
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
  const gateNumber = (code: string) => {
    const match = /^(?:DOM)?GATE(\d+)$/i.exec(code);
    return match ? Number(match[1]) : 999;
  };
  const byGateNumber = (a: LocationDTO, b: LocationDTO) =>
    gateNumber(a.code) - gateNumber(b.code);
  const internationalGates = gates
    .filter((item) => item.code.startsWith("GATE") && gateNumber(item.code) <= 6)
    .sort(byGateNumber);
  const domesticGates = gates
    .filter((item) => item.code.startsWith("DOMGATE"))
    .sort(byGateNumber);
  const groupedGateIds = new Set(
    [...internationalGates, ...domesticGates].map((item) => item._id)
  );
  const gateGroups = [
    { label: "Олон улсын", items: internationalGates },
    { label: "Дотоод", items: domesticGates },
    {
      label: "Бусад",
      items: gates.filter((item) => !groupedGateIds.has(item._id)),
    },
  ].filter((group) => group.items.length > 0);
  const checkinGroups = [
    { label: "A Бүртгэлийн цэг", items: checkins.filter((item) => item.code.startsWith("A")) },
    { label: "C Бүртгэлийн цэг", items: checkins.filter((item) => item.code.startsWith("C")) },
    { label: "D Бүртгэлийн цэг", items: checkins.filter((item) => item.code.startsWith("D")) },
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
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={locationType === "checkin"}
          onClick={() => chooseType("checkin")}
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-xl border-2",
            locationType === "checkin"
              ? "border-primary bg-nubia-light"
              : "border-border bg-white"
          )}
        >
          <MonitorSmartphone className="size-4 text-primary" />
          <span className="text-sm font-semibold text-navy">Check-in</span>
        </button>
        <button
          type="button"
          aria-pressed={locationType === "gate"}
          onClick={() => chooseType("gate")}
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-xl border-2",
            locationType === "gate"
              ? "border-primary bg-nubia-light"
              : "border-border bg-white"
          )}
        >
          <Plane className="size-4 text-primary" />
          <span className="text-sm font-semibold text-navy">Gate</span>
        </button>
      </div>

      {locationType === "checkin" ? (
        <div className="space-y-2">
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
          {gateGroups.map((group) => (
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
                    {`Gate ${gateNumber(location.code)}`}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
