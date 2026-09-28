import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type FilterChangeHandler = (filters: {
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

  // Read current filter values from URL
  const currentFilters = useMemo(
    () => ({
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
    }),
    [searchParams],
  );

  const filterFields: FilterFieldConfig[] = [
    {
      key: "start_date",
      label: "Tanggal Mulai",
      showLabel: true,
      type: "calendar",
      placeholder: "Pilih tanggal mulai...",
      isClearable: false,
    },
    {
      key: "end_date",
      label: "Tanggal Selesai",
      showLabel: true,
      type: "calendar",
      placeholder: "Pilih tanggal selesai...",
      isClearable: false,
    },
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // Date values - convert string from URL to Date object for FilterPanel
    if (currentFilters.start_date) {
      const [year, month, day] = currentFilters.start_date
        .split("-")
        .map(Number);
      values.start_date = new Date(year, month - 1, day);
    }
    if (currentFilters.end_date) {
      const [year, month, day] = currentFilters.end_date.split("-").map(Number);
      values.end_date = new Date(year, month - 1, day);
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters]);

  // Helper to convert date values to YYYY-MM-DD string
  const getDateValue = (
    key: string,
    data: Record<string, FilterValue>,
  ): string | undefined => {
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
