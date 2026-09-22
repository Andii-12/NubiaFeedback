"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultFormState,
  type AirlineDTO,
  type DeviceType,
  type FeedbackFormState,
  type LocationDTO,
  type LocationType,
} from "@/types";
import { PRINT_DEVICES, SCAN_DEVICES, WS_DEVICES } from "@/lib/constants";

const STORAGE_KEY = "nubia-feedback-form";

type FormContextValue = {
  form: FeedbackFormState;
  setForm: React.Dispatch<React.SetStateAction<FeedbackFormState>>;
  update: <K extends keyof FeedbackFormState>(
    key: K,
    value: FeedbackFormState[K]
  ) => void;
  reset: () => void;
  showPrinting: boolean;
  showScanning: boolean;
  showWorkstation: boolean;
};

const FormContext = createContext<FormContextValue | null>(null);

function savedLocations(parsed: Partial<FeedbackFormState> & {
  locationId?: string;
  locationType?: LocationType | "";
}) {
  const locationIds = Array.isArray(parsed.locationIds)
    ? parsed.locationIds.filter(Boolean)
    : parsed.locationId
      ? [parsed.locationId]
      : [];
  const locationTypes = Array.isArray(parsed.locationTypes)
    ? parsed.locationTypes.filter(Boolean)
    : parsed.locationType
      ? [parsed.locationType]
      : [];
  return { locationIds, locationTypes };
}

export function FeedbackFormProvider({
  children,
  prefill,
}: {
  children: React.ReactNode;
  prefill?: Partial<FeedbackFormState>;
}) {
  const [form, setForm] = useState<FeedbackFormState>(() => ({
    ...defaultFormState(),
    ...prefill,
  }));
  const [hydrated, setHydrated] = useState(false);

  const prefillIds = prefill?.locationIds?.join(",") ?? "";
  const prefillTypes = prefill?.locationTypes?.join(",") ?? "";

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FeedbackFormState & {
          locationId?: string;
          locationType?: LocationType | "";
        };
        const stored = savedLocations(parsed);
        setForm({
          ...defaultFormState(),
          ...parsed,
          airlineId: parsed.airlineId || prefill?.airlineId || "",
          locationIds: prefill?.locationIds?.length
            ? prefill.locationIds
            : stored.locationIds,
          locationTypes: prefill?.locationTypes?.length
            ? prefill.locationTypes
            : stored.locationTypes,
          deviceAnswers: Array.isArray(parsed.deviceAnswers)
            ? parsed.deviceAnswers
            : [],
        });
      } catch {
        /* ignore */
      }
    } else if (prefill) {
      setForm((prev) => ({ ...prev, ...prefill }));
    }
    setHydrated(true);
  }, [prefillIds, prefillTypes, prefill?.airlineId]);

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, hydrated]);

  const value = useMemo(() => {
    const showPrinting = form.devices.some((d) =>
      PRINT_DEVICES.includes(d as DeviceType)
    );
    const showScanning = form.devices.some((d) =>
      SCAN_DEVICES.includes(d as DeviceType)
    );
    const showWorkstation = form.devices.some((d) =>
      WS_DEVICES.includes(d as DeviceType)
    );

    return {
      form,
      setForm,
      update: <K extends keyof FeedbackFormState>(
        key: K,
        value: FeedbackFormState[K]
      ) => setForm((prev) => ({ ...prev, [key]: value })),
      reset: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setForm(defaultFormState());
      },
      showPrinting,
      showScanning,
      showWorkstation,
    };
  }, [form]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFeedbackForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("Feedback form context missing");
  return ctx;
}

export function useCatalog() {
  const [airlines, setAirlines] = useState<AirlineDTO[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [a, l] = await Promise.all([
          fetch("/api/airlines").then((r) => r.json()),
          fetch("/api/locations").then((r) => r.json()),
        ]);
        setAirlines(a.airlines || []);
        setLocations(l.locations || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { airlines, locations, loading };
}
