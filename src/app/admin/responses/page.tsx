"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { FeedbackTable } from "@/components/admin/FeedbackTable";
import {
  defaultFilters,
  FilterBar,
  type FilterState,
} from "@/components/admin/FilterBar";
import type { AirlineDTO, FeedbackDTO, LocationDTO } from "@/types";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/LocaleProvider";

export default function ResponsesPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters());
  const [items, setItems] = useState<FeedbackDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [airlines, setAirlines] = useState<AirlineDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const { t } = useI18n();

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(page));
    params.set("limit", "20");
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    fetch("/api/admin/airlines")
      .then((r) => r.json())
      .then((d) => setAirlines(d.airlines || []));
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations || []));
  }, []);

  useEffect(() => {
    fetch(`/api/admin/feedback?${query}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setTotal(d.total || 0);
      });
  }, [query]);

  function exportData(format: "csv" | "xlsx") {
    window.location.href = `/api/admin/export?${query}&format=${format}`;
  }

  async function remove(item: FeedbackDTO) {
    if (!confirm(`${item.requestId} ${t.table.confirm}`)) return;
    const res = await fetch(`/api/admin/feedback/${item._id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t.table.deleteFail);
      return;
    }
    toast.success(t.table.deleted);
    setItems((prev) => prev.filter((row) => row._id !== item._id));
    setTotal((n) => Math.max(0, n - 1));
  }

  return (
    <AdminShell title={t.nav.responses}>
      <FilterBar
        filters={filters}
        onChange={(next) => {
          setPage(1);
          setFilters(next);
        }}
        airlines={airlines}
        locations={locations}
        onExport={() => exportData("xlsx")}
      />
      <div className="mt-4 rounded-[16px] border border-border bg-white p-4">
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} {t.table.count}
          </span>
          <button
            type="button"
            className="text-primary"
            onClick={() => exportData("csv")}
          >
            {t.table.csv}
          </button>
        </div>
        <FeedbackTable
          items={items}
          onDelete={remove}
          sort={filters.sort}
          onSort={(sort) => {
            setPage(1);
            setFilters((prev) => ({ ...prev, sort }));
          }}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
          >
            {t.table.prev}
          </button>
          <button
            type="button"
            disabled={page * 20 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
          >
            {t.table.next}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
