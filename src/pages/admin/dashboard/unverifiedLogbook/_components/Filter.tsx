import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";

type FilterChangeHandler = (filters: {
  id_ppds?: number | null;
  id_staff?: number | null;
  id_activity?: number | null;
  id_stase?: number | null;
  start_date?: string;
  end_date?: string;
}) => void;

type FilterResetHandler = () => void;

export const Filter = ({
  initialStaffId,
  onChange,
  onReset,
}: {
  initialStaffId?: number;
  onChange: FilterChangeHandler;
  onReset: FilterResetHandler;
}) => {
  const [searchParams] = useSearchParams();

  const {
    ppdsActiveOptions,
    staffOptions,
    staseOptions,
    activityOptions,
    fetchPPDSActiveOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
    fetchLogbookStatusOptions,
  } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSActiveOptions({ id_client: user.id_client });
      fetchStaffOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
      fetchActivityOptions({ id_client: user.id_client });
      fetchLogbookStatusOptions();
    }
  }, [user?.id_client, fetchPPDSActiveOptions, fetchStaffOptions, fetchStaseOptions, fetchActivityOptions, fetchLogbookStatusOptions]);

  // Read current filter values from URL
  const currentFilters = useMemo(() => ({
    id_staff: searchParams.get("id_staff") ? Number(searchParams.get("id_staff")) : null,
    id_ppds: searchParams.get("id_ppds") ? Number(searchParams.get("id_ppds")) : null,
    id_activity: searchParams.get("id_activity") ? Number(searchParams.get("id_activity")) : null,
    id_stase: searchParams.get("id_stase") ? Number(searchParams.get("id_stase")) : null,
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
  }), [searchParams]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "id_staff",
      label: "Staff",
      type: "select",
      options: staffOptions,
      placeholder: "Pilih Staff...",
    },
    {
      key: "id_ppds",
      label: "PPDS",
      type: "select",
      options: ppdsActiveOptions,
      placeholder: "Pilih PPDS...",
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
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // Staff option from URL or initial
    const staffId = currentFilters.id_staff || initialStaffId;
    if (staffId) {
      const staffOpt = staffOptions.find(opt => opt.value === staffId);
      if (staffOpt) values.id_staff = staffOpt;
    }
    // PPDS option from URL
    if (currentFilters.id_ppds) {
      const ppdsOpt = ppdsActiveOptions.find(opt => opt.value === currentFilters.id_ppds);
      if (ppdsOpt) values.id_ppds = ppdsOpt;
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
    // Date values
    if (currentFilters.start_date) {
      values.start_date = currentFilters.start_date;
    }
    if (currentFilters.end_date) {
      values.end_date = currentFilters.end_date;
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters, initialStaffId, staffOptions, ppdsActiveOptions, activityOptions, staseOptions]);

  const handleSearch = (data: Record<string, FilterValue>) => {
    const filters = {
      id_ppds: (data.id_ppds as { value: number })?.value ?? null,
      id_staff: (data.id_staff as { value: number })?.value ?? null,
      id_activity: (data.id_activity as { value: number })?.value ?? null,
      id_stase: (data.id_stase as { value: number })?.value ?? null,
      start_date: typeof data.start_date === "string" ? data.start_date : undefined,
      end_date: typeof data.end_date === "string" ? data.end_date : undefined,
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