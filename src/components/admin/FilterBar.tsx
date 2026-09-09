"use client";

import { useState } from "react";
import type { AirlineDTO, LocationDTO } from "@/types";
import { DEVICES, DEVICE_STATUS, FULLY_RESOLVED, IMPACT_LEVELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onChange(defaultFilters());
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "range") return false;
    return value !== "";
  }).length;

  const selectClass =
    "h-10 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20";

  const DateRangeButtons = () => (
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
  );

  const FilterSelects = () => (
    <>
      {filters.range === "custom" && (
        <div className="col-span-full grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">From</label>
            <input
              type="date"
              className={selectClass}
              value={filters.from}
              onChange={(e) => set("from", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
            <input
              type="date"
              className={selectClass}
              value={filters.to}
              onChange={(e) => set("to", e.target.value)}
            />
          </div>
        </div>
      )}
      
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
    </>
  );

  return (
    <div className="space-y-3 rounded-[16px] border border-border bg-white p-3 sm:p-4">
      {/* Date Range - Always Visible */}
      <DateRangeButtons />

      {/* Mobile View - Sheet/Drawer */}
      <div className="flex gap-2 lg:hidden">
        <input
          className={`${selectClass} flex-1`}
          placeholder="Search ID, comment..."
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
        />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className="relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border bg-white px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <FilterSelects />
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
            {onExport && (
              <Button
                onClick={() => {
                  onExport();
                  setIsOpen(false);
                }}
                className="mt-3 w-full"
                variant="secondary"
              >
                Export CSV / Excel
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View - Full Grid */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3 xl:grid-cols-4">
        <FilterSelects />
        <input
          className={selectClass}
          placeholder="Search ID, comment..."
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
        />
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="h-10 rounded-lg bg-navy px-4 text-sm font-medium text-white transition-colors hover:bg-navy/90"
          >
            Export CSV / Excel
          </button>
        )}
      </div>
    </div>
  );
}
