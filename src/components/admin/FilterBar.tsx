"use client";

import { useState } from "react";
import type { AirlineDTO, LocationDTO } from "@/types";
import { DEVICES, DEVICE_STATUS, FULLY_RESOLVED, IMPACT_LEVELS } from "@/lib/constants";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { optionLabel } from "@/lib/i18n/options";

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
  sort: string;
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
  sort: "newest",
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
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ranges = [
    ["today", t.filters.today],
    ["yesterday", t.filters.yesterday],
    ["this_week", t.filters.week],
    ["this_month", t.filters.month],
    ["custom", t.filters.custom],
  ] as const;
  const sorts = [
    ["newest", t.filters.newest],
    ["oldest", t.filters.oldest],
    ["date_desc", t.filters.dateNew],
    ["date_asc", t.filters.dateOld],
    ["rating_desc", t.filters.ratingHigh],
    ["rating_asc", t.filters.ratingLow],
  ] as const;

  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  const activeFilterCount = [
    filters.airlineId,
    filters.locationId,
    filters.locationType,
    filters.device,
    filters.rating,
    filters.status,
    filters.resolved,
    filters.impact,
  ].filter(Boolean).length;

  const selectClass =
    "h-10 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-3 rounded-[16px] border border-border bg-white p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        {ranges.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => set("range", value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              filters.range === value
                ? "bg-primary text-white"
                : "bg-nubia-light text-navy hover:bg-primary/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filters.range === "custom" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            aria-label="From"
            className={selectClass}
            value={filters.from}
            onChange={(e) => set("from", e.target.value)}
          />
          <input
            type="date"
            aria-label="To"
            className={selectClass}
            value={filters.to}
            onChange={(e) => set("to", e.target.value)}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={`${selectClass} min-w-0 flex-1`}
          placeholder={t.filters.search}
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
        />
        <select
          aria-label={t.filters.rating}
          className={`${selectClass} sm:w-44`}
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value)}
        >
          {sorts.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="h-10 rounded-lg border border-border px-3 text-sm font-medium text-navy"
        >
          {t.filters.filter}
          {activeFilterCount ? ` (${activeFilterCount})` : ""}
        </button>
        {onExport ? (
          <button
            type="button"
            onClick={onExport}
            className="h-10 rounded-lg bg-navy px-4 text-sm font-medium text-white"
          >
            {t.filters.excel}
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            aria-label="Airline"
            className={selectClass}
            value={filters.airlineId}
            onChange={(e) => set("airlineId", e.target.value)}
          >
            <option value="">{t.filters.allAirlines}</option>
            {airlines.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Type"
            className={selectClass}
            value={filters.locationType}
            onChange={(e) => set("locationType", e.target.value)}
          >
            <option value="">{t.filters.allTypes}</option>
            <option value="checkin">Check-in</option>
            <option value="gate">Gate</option>
          </select>
          <select
            aria-label="Location"
            className={selectClass}
            value={filters.locationId}
            onChange={(e) => set("locationId", e.target.value)}
          >
            <option value="">{t.filters.allLocations}</option>
            {locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Device"
            className={selectClass}
            value={filters.device}
            onChange={(e) => set("device", e.target.value)}
          >
            <option value="">{t.filters.allDevices}</option>
        {DEVICES.map((d) => (
          <option key={d.value} value={d.value}>
            {optionLabel(locale, "device", d.value)}
          </option>
        ))}
          </select>
          <select
            aria-label="Technical status"
            className={selectClass}
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="">{t.filters.status}</option>
            {DEVICE_STATUS.map((d) => (
              <option key={d.value} value={d.value}>
                {optionLabel(locale, "status", d.value)}
              </option>
            ))}
          </select>
          <select
            aria-label="Engineer rating"
            className={selectClass}
            value={filters.rating}
            onChange={(e) => set("rating", e.target.value)}
          >
            <option value="">{t.filters.rating}</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
          <select
            aria-label="Resolution"
            className={selectClass}
            value={filters.resolved}
            onChange={(e) => set("resolved", e.target.value)}
          >
            <option value="">{t.filters.resolution}</option>
            {FULLY_RESOLVED.map((d) => (
              <option key={d.value} value={d.value}>
                {optionLabel(locale, "resolved", d.value)}
              </option>
            ))}
          </select>
          <select
            aria-label="Issue severity"
            className={selectClass}
            value={filters.impact}
            onChange={(e) => set("impact", e.target.value)}
          >
            <option value="">{t.filters.severity}</option>
            {IMPACT_LEVELS.map((d) => (
              <option key={d.value} value={d.value}>
                {optionLabel(locale, "impact", d.value)}
              </option>
            ))}
          </select>
          {activeFilterCount ? (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...defaultFilters(),
                  range: filters.range,
                  from: filters.from,
                  to: filters.to,
                  q: filters.q,
                  sort: filters.sort,
                })
              }
              className="h-10 rounded-lg border border-border px-3 text-sm text-navy"
            >
              {t.filters.clear}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
