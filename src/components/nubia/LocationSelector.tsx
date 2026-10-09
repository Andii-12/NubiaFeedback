"use client";

import { MonitorSmartphone, Plane } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import type { LocationDTO, LocationType } from "@/types";

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
  const { t } = useI18n();
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
    { label: t.form.intl, items: internationalGates },
    { label: t.form.domestic, items: domesticGates },
    {
      label: t.form.other,
      items: gates.filter((item) => !groupedGateIds.has(item._id)),
    },
  ].filter((group) => group.items.length > 0);
  const checkinGroups = [
    { label: t.form.deskA, items: checkins.filter((item) => item.code.startsWith("A")) },
    { label: t.form.deskC, items: checkins.filter((item) => item.code.startsWith("C")) },
    { label: t.form.deskD, items: checkins.filter((item) => item.code.startsWith("D")) },
    {
      label: t.form.other,
      items: checkins.filter((item) => !/^[ACD]/.test(item.code)),
    },
  ].filter((group) => group.items.length > 0);

  function chooseType(type: LocationType) {
    if (locationType === type) return;
    onChange({ locationTypes: [type], locationIds: [] });
  }

  function chooseLocation(id: string) {
    if (!locationType) return;
    onChange({ locationTypes: [locationType], locationIds: id ? [id] : [] });
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
        <select
          className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-navy outline-none focus:border-primary"
          value={selectedId}
          onChange={(event) => chooseLocation(event.target.value)}
        >
          <option value="">{t.form.pickCheckin}</option>
          {checkinGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.items.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : null}

      {locationType === "gate" ? (
        <select
          className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-navy outline-none focus:border-primary"
          value={selectedId}
          onChange={(event) => chooseLocation(event.target.value)}
        >
          <option value="">{t.form.pickGate}</option>
          {gateGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.items.map((location) => (
                <option key={location._id} value={location._id}>
                  {`Gate ${gateNumber(location.code)}`}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : null}
    </div>
  );
}
