import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";

type FilterChangeHandler = (filters: {
  staff?: number | null;
  nim?: string | null;
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
  const { staffOptions, fetchStaffOptions } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchStaffOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchStaffOptions]);

  // Read current filter values from URL
  const currentFilters = useMemo(() => ({
    staff: searchParams.get("staff") ? Number(searchParams.get("staff")) : null,
    nim: searchParams.get("nim") || undefined,
  }), [searchParams]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "staff",
      label: "Staff",
      type: "select",
      options: staffOptions,
      placeholder: "Pilih Staff...",
    },
    {
      key: "nim",
      label: "NIM",
      type: "input",
      placeholder: "Masukkan NIM...",
    },
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // Staff option from URL
    if (currentFilters.staff) {
      const staffOpt = staffOptions.find(opt => opt.value === currentFilters.staff);
      if (staffOpt) values.staff = staffOpt;
    }

    // Nim is a string input
    if (currentFilters.nim) {
      values.nim = currentFilters.nim;
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters, staffOptions]);

  const handleSearch = (data: Record<string, FilterValue>) => {
    const filters = {
      staff: data.staff && typeof data.staff === "object" && "value" in data.staff
        ? (data.staff as { value: number }).value ?? null
        : null,
      nim: typeof data.nim === "string" ? data.nim || null : null,
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