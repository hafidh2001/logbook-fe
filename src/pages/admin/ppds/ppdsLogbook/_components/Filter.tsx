import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useLocation, useSearchParams } from "react-router-dom";

type FilterChangeHandler = (filters: {
  id_staff?: number | null;
  id_activity?: number | null;
  id_stase?: number | null;
  status?: string | null;
  start_date?: string;
  end_date?: string;
}) => void;

type FilterResetHandler = () => void;

export const Filter = ({
  initialPpdsId,
  onChange,
  onReset,
}: {
  initialPpdsId?: number;
  onChange: FilterChangeHandler;
  onReset: FilterResetHandler;
}) => {
  const [searchParams] = useSearchParams();

  const {
    ppdsActiveOptions,
    ppdsInactiveOptions,
    staffOptions,
    staseOptions,
    activityOptions,
    logbookStatusOptions,
    fetchPPDSActiveOptions,
    fetchPPDSInactiveOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
    fetchLogbookStatusOptions,
  } = useMasterStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isInactive = location.pathname.includes("/ppds-inactive/");

  useEffect(() => {
    if (user?.id_client) {
      if (!isInactive) {
        fetchPPDSActiveOptions({ id_client: user.id_client });
      } else {
        fetchPPDSInactiveOptions({ id_client: user.id_client });
      }
      fetchStaffOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
      fetchActivityOptions({ id_client: user.id_client });
      fetchLogbookStatusOptions();
    }
  }, [
    user?.id_client,
    isInactive,
    fetchPPDSActiveOptions,
    fetchPPDSInactiveOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
    fetchLogbookStatusOptions,
  ]);

  // Find the PPDS option that matches initialPpdsId to get correct label
  const initialPpdsOption = useMemo(() => {
    if (!initialPpdsId) return undefined;
    if (!isInactive) {
      return ppdsActiveOptions.find((opt) => opt.value === initialPpdsId);
    } else {
      return ppdsInactiveOptions.find((opt) => opt.value === initialPpdsId);
    }
  }, [initialPpdsId, ppdsActiveOptions, ppdsInactiveOptions, isInactive]);

  // Read current filter values from URL
  const currentFilters = useMemo(() => ({
    id_staff: searchParams.get("id_staff") ? Number(searchParams.get("id_staff")) : null,
    id_activity: searchParams.get("id_activity") ? Number(searchParams.get("id_activity")) : null,
    id_stase: searchParams.get("id_stase") ? Number(searchParams.get("id_stase")) : null,
    status: searchParams.get("status") || undefined,
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
  }), [searchParams]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "id_ppds",
      label: "PPDS",
      type: "select",
      options: !isInactive ? ppdsActiveOptions : ppdsInactiveOptions,
      placeholder: "Pilih PPDS...",
      disabled: true, // PPDS is controlled by URL, not filter
    },
    {
      key: "id_staff",
      label: "Staff",
      type: "select",
      options: staffOptions,
      placeholder: "Pilih Staff...",
    },
    {
      key: "id_activity",
      label: "Activity",
      type: "select",
      options: activityOptions,
      placeholder: "Pilih Activity...",
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
    {
      key: "status",
      label: "Status",
      type: "select",
      options: logbookStatusOptions,
      placeholder: "Pilih Status...",
    },
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // PPDS from initial (controlled by URL, not filter) - always show
    if (initialPpdsOption) {
      values.id_ppds = initialPpdsOption;
    }

    // Staff option from URL
    if (currentFilters.id_staff) {
      const staffOpt = staffOptions.find(opt => opt.value === currentFilters.id_staff);
      if (staffOpt) values.id_staff = staffOpt;
    }
    // Activity option from URL
    if (currentFilters.id_activity) {
      const activityOpt = activityOptions.find(opt => opt.value === currentFilters.id_activity);
      if (activityOpt) values.id_activity = activityOpt;
    }
    // Stase option from URL
    if (currentFilters.id_stase) {
      const staseOpt = staseOptions.find(opt => opt.value === currentFilters.id_stase);
      if (staseOpt) values.id_stase = staseOpt;
    }
    // Status option from URL
    if (currentFilters.status) {
      const statusOpt = logbookStatusOptions.find(opt => opt.value === currentFilters.status);
      if (statusOpt) values.status = statusOpt;
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
  }, [currentFilters, initialPpdsOption, staffOptions, activityOptions, staseOptions, logbookStatusOptions]);

  const handleSearch = (data: Record<string, FilterValue>) => {
    // Helper to convert select FilterValue to number value
    const getSelectValue = (key: string): number | null => {
      const val = data[key];
      if (val && typeof val === "object" && "value" in val) {
        return (val as { value: number }).value ?? null;
      }
      return null;
    };

    // Helper to convert date values to YYYY-MM-DD string
    const getDateValue = (key: string): string | undefined => {
      const val = data[key];
      if (!val) return undefined;
      // Handle Date object from CalendarSelect
      if (val instanceof Date) {
        const day = String(val.getDate()).padStart(2, "0");
        const month = String(val.getMonth() + 1).padStart(2, "0");
        const year = val.getFullYear();
        return `${year}-${month}-${day}`;
      }
      return undefined;
    };

    // Helper to get string value (for status)
    const getStringValue = (key: string): string | null => {
      const val = data[key];
      if (val && typeof val === "object" && "value" in val) {
        return String((val as { value: string }).value) ?? null;
      }
      return null;
    };

    const filters = {
      id_staff: getSelectValue("id_staff"),
      id_activity: getSelectValue("id_activity"),
      id_stase: getSelectValue("id_stase"),
      status: getStringValue("status"),
      start_date: getDateValue("start_date"),
      end_date: getDateValue("end_date"),
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
