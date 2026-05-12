import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";

type FilterChangeHandler = (filters: {
  id_ppds?: number | null;
  id_stase?: number | null;
  start_date?: string;
  end_date?: string;
}) => void;

type FilterResetHandler = () => void;

export const Filter = ({
  onChange,
  onReset,
}: {
  onChange: FilterChangeHandler;
  onReset: FilterResetHandler;
}) => {
  const [searchParams] = useSearchParams();

  const { ppdsOptions, staseOptions, fetchPPDSOptions, fetchStaseOptions } =
    useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchPPDSOptions, fetchStaseOptions]);

  // Read current filter values from URL
  const currentFilters = useMemo(() => ({
    id_ppds: searchParams.get("id_ppds") ? Number(searchParams.get("id_ppds")) : null,
    id_stase: searchParams.get("id_stase") ? Number(searchParams.get("id_stase")) : null,
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
  }), [searchParams]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "id_ppds",
      label: "PPDS",
      type: "select",
      options: ppdsOptions,
      placeholder: "Pilih PPDS...",
    },
    {
      key: "id_stase",
      label: "Stase",
      type: "select",
      options: staseOptions,
      placeholder: "Pilih Stase...",
    },
    {
      key: "start_date",
      label: "Tanggal Mulai",
      type: "calendar",
      placeholder: "Pilih tanggal mulai...",
    },
    {
      key: "end_date",
      label: "Tanggal Selesai",
      type: "calendar",
      placeholder: "Pilih tanggal selesai...",
    },
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // PPDS option from URL
    if (currentFilters.id_ppds) {
      const ppdsOpt = ppdsOptions.find(opt => opt.value === currentFilters.id_ppds);
      if (ppdsOpt) values.id_ppds = ppdsOpt;
    }
    // Stase option from URL
    if (currentFilters.id_stase) {
      const staseOpt = staseOptions.find(opt => opt.value === currentFilters.id_stase);
      if (staseOpt) values.id_stase = staseOpt;
    }
    // Date values - convert string from URL to Date object for FilterPanel
    if (currentFilters.start_date) {
      const [year, month, day] = currentFilters.start_date.split("-").map(Number);
      values.start_date = new Date(year, month - 1, day);
    }
    if (currentFilters.end_date) {
      const [year, month, day] = currentFilters.end_date.split("-").map(Number);
      values.end_date = new Date(year, month - 1, day);
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters, ppdsOptions, staseOptions]);

  // Helper to get number value from select option
  const getSelectValue = (key: string, data: Record<string, FilterValue>): number | null => {
    const val = data[key];
    if (val && typeof val === "object" && "value" in val) {
      return (val as { value: number }).value ?? null;
    }
    return null;
  };

  // Helper to convert date values to YYYY-MM-DD string
  const getDateValue = (key: string, data: Record<string, FilterValue>): string | undefined => {
    const val = data[key];
    if (!val) return undefined;
    if (val instanceof Date) {
      const day = String(val.getDate()).padStart(2, "0");
      const month = String(val.getMonth() + 1).padStart(2, "0");
      const year = val.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return undefined;
  };

  const handleSearch = (data: Record<string, FilterValue>) => {
    const filters = {
      id_ppds: getSelectValue("id_ppds", data),
      id_stase: getSelectValue("id_stase", data),
      start_date: getDateValue("start_date", data),
      end_date: getDateValue("end_date", data),
    };
    onChange(filters);
  };

  return (
    <FilterPanel
      fields={filterFields}
      onSearch={handleSearch}
      onReset={onReset}
      syncValues={syncValues}
    />
  );
};
