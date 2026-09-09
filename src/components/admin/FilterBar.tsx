"use client";

import type { AirlineDTO, LocationDTO } from "@/types";
import { DEVICES, DEVICE_STATUS, FULLY_RESOLVED, IMPACT_LEVELS } from "@/lib/constants";

export type FilterState = {
  range: string;
  from: string;
  to: string;
  airlineId: string;
  locationId: string;
  locationType: string;
  device: string;
  rating: string;
  status: string;
  resolved: string;
  impact: string;
  q: string;
};

export const defaultFilters = (): FilterState => ({
  range: "this_month",
  from: "",
  to: "",
  airlineId: "",
  locationId: "",
  locationType: "",
  device: "",
  rating: "",
  status: "",
  resolved: "",
  impact: "",
  q: "",
});

export function FilterBar({
  filters,
  onChange,
  airlines,
  locations,
  onExport,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  airlines: AirlineDTO[];
  locations: LocationDTO[];
  onExport?: () => void;
}) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  const selectClass =
    "h-9 rounded-lg border border-border bg-white px-2 text-sm outline-none";

  return (
    <div className="space-y-3 rounded-[16px] border border-border bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["today", "Today"],
          ["yesterday", "Yesterday"],
          ["this_week", "This week"],
          ["this_month", "This month"],
          ["custom", "Custom"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => set("range", value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              filters.range === value
                ? "bg-primary text-white"
                : "bg-nubia-light text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
        {filters.range === "custom" ? (
          <>
            <input
              type="date"
              className={selectClass}
              value={filters.from}
              onChange={(e) => set("from", e.target.value)}
            />
            <input
              type="date"
              className={selectClass}
              value={filters.to}
              onChange={(e) => set("to", e.target.value)}
            />
          </>
        ) : null}
        <select
          className={selectClass}
          value={filters.airlineId}
          onChange={(e) => set("airlineId", e.target.value)}
        >
          <option value="">All airlines</option>
          {airlines.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.locationType}
          onChange={(e) => set("locationType", e.target.value)}
        >
          <option value="">All types</option>
          <option value="checkin">Check-in</option>
          <option value="gate">Gate</option>
        </select>
        <select
          className={selectClass}
          value={filters.locationId}
          onChange={(e) => set("locationId", e.target.value)}
        >
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.device}
          onChange={(e) => set("device", e.target.value)}
        >
          <option value="">All devices</option>
          {DEVICES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="">Technical status</option>
          {DEVICE_STATUS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.rating}
          onChange={(e) => set("rating", e.target.value)}
        >
          <option value="">Engineer rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={String(n)}>
              {n}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.resolved}
          onChange={(e) => set("resolved", e.target.value)}
        >
          <option value="">Resolution</option>
          {FULLY_RESOLVED.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.impact}
          onChange={(e) => set("impact", e.target.value)}
        >
          <option value="">Issue severity</option>
          {IMPACT_LEVELS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.severity} · {d.label}
            </option>
          ))}
        </select>
        <input
          className={selectClass}
          placeholder="Search ID, comment..."
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
        />
        {onExport ? (
          <button
            type="button"
            onClick={onExport}
            className="h-9 rounded-lg bg-navy px-3 text-sm font-medium text-white"
          >
            Export CSV / Excel
          </button>
        ) : null}
      </div>
    </div>
  );
}
