import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";
import { UserStatusEnum } from "@/types";

type FilterChangeHandler = (filters: {
  ppds?: number | null;
  stase?: number | null;
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
    ppdsInactiveOptions,
    staseOptions,
    userStatusOptions,
    fetchPPDSInactiveOptions,
    fetchStaseOptions,
    fetchUserStatusOptions,
  } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSInactiveOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
      fetchUserStatusOptions();
    }
  }, [
    user?.id_client,
    fetchPPDSInactiveOptions,
    fetchStaseOptions,
    fetchUserStatusOptions,
  ]);

  // Read current filter values from URL
  const currentFilters = useMemo(
    () => ({
      ppds: searchParams.get("ppds") ? Number(searchParams.get("ppds")) : null,
      stase: searchParams.get("stase")
        ? Number(searchParams.get("stase"))
        : null,
      nim: searchParams.get("nim") || undefined,
      status: searchParams.get("status") ? Number(searchParams.get("status")) : null,
    }),
    [searchParams],
  );

  const filterFields: FilterFieldConfig[] = [
    {
      key: "ppds",
      label: "PPDS",
      type: "select",
      options: ppdsInactiveOptions,
      placeholder: "Pilih PPDS...",
    },
    {
      key: "stase",
      label: "Stase",
      type: "select",
      options: staseOptions,
      placeholder: "Pilih Stase...",
    },
    {
      key: "nim",
      label: "NIM",
      type: "input",
      placeholder: "Masukkan NIM...",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: userStatusOptions.filter(
        (opt) => opt.value !== UserStatusEnum.ACTIVE,
      ),
      placeholder: "Pilih Status...",
    },
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // PPDS option from URL
    if (currentFilters.ppds) {
      const ppdsOpt = ppdsInactiveOptions.find(
        (opt) => opt.value === currentFilters.ppds,
      );
      if (ppdsOpt) values.ppds = ppdsOpt;
    }

    // Stase option from URL
    if (currentFilters.stase) {
      const staseOpt = staseOptions.find(
        (opt) => opt.value === currentFilters.stase,
      );
      if (staseOpt) values.stase = staseOpt;
    }

    // NIM is an input field, pass as string
    if (currentFilters.nim) {
      values.nim = currentFilters.nim;
    }

    // Status option from URL
    if (currentFilters.status) {
      const userStatusOpt = userStatusOptions.find(
        (opt) => opt.value === String(currentFilters.status),
      );
      if (userStatusOpt) values.status = userStatusOpt;
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters, ppdsInactiveOptions, staseOptions, userStatusOptions]);

  const handleSearch = (data: Record<string, FilterValue>) => {
    // Helper to convert select FilterValue to number value
    const getSelectValue = (key: string): number | null => {
      const val = data[key];
      if (val && typeof val === "object" && "value" in val) {
        return (val as { value: number }).value ?? null;
      }
      return null;
    };

    // Helper to get string value for input type
    const getStringValue = (key: string): string | null => {
      const val = data[key];
      if (typeof val === "string") return val || null;
      return null;
    };

    const filters = {
      ppds: getSelectValue("ppds"),
      stase: getSelectValue("stase"),
      nim: getStringValue("nim"),
      status: getSelectValue("status"),
    };
    onChange(filters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <FilterPanel
      fields={filterFields}
      onSearch={handleSearch}
      onReset={handleReset}
      syncValues={syncValues}
    />
  );
};
