import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";
import { BasicSelectOpt } from "@/types";

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
  const {
    staffOptions,
    fetchStaffOptions,
    roleStaffOptions,
    fetchRoleStaffOptions,
  } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchStaffOptions({ id_client: user.id_client });
      fetchRoleStaffOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchStaffOptions, fetchRoleStaffOptions]);

  // Read current filter values from URL
  const currentFilters = useMemo(
    () => ({
      staff: searchParams.get("staff")
        ? Number(searchParams.get("staff"))
        : null,
      role: searchParams.get("role") ? Number(searchParams.get("role")) : null,
      nim: searchParams.get("nim") || undefined,
    }),
    [searchParams],
  );

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
    {
      key: "role",
      label: "Role",
      type: "select",
      options: roleStaffOptions.map(
        (opt) =>
          ({
            value: opt.label,
            label: opt.label,
          }) as BasicSelectOpt<string>,
      ),
      placeholder: "Pilih Role Staff...",
    },
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // Staff option from URL
    if (currentFilters.staff) {
      const staffOpt = staffOptions.find(
        (opt) => opt.value === currentFilters.staff,
      );
      if (staffOpt) values.staff = staffOpt;
    }

    // Nim is a string input
    if (currentFilters.nim) {
      values.nim = currentFilters.nim;
    }

    // Staff option from URL
    if (currentFilters.role) {
      const roleOpt = roleStaffOptions.find(
        (opt) => opt.value === currentFilters.role,
      );
      if (roleOpt) values.role = roleOpt;
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters, staffOptions, roleStaffOptions]);

  const handleSearch = (data: Record<string, FilterValue>) => {
    const filters = {
      staff:
        data.staff && typeof data.staff === "object" && "value" in data.staff
          ? ((data.staff as { value: number }).value ?? null)
          : null,
      nim: typeof data.nim === "string" ? data.nim || null : null,
      role:
        data.role && typeof data.role === "object" && "value" in data.role
          ? ((data.role as { value: number }).value ?? null)
          : null,
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
