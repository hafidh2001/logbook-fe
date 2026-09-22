import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterValue } from "@/components/filterPanel";
import type { BasicSelectOpt } from "@/types";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";

type FilterChangeHandler = (filters: {
  ppds_name?: string | null;
  staff_name?: string | null;
  activity_name?: string | null;
  stase_name?: string | null;
  start_date?: string;
  end_date?: string;
  status?: string | null;
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
    ppdsActiveOptions,
    staffOptions,
    staseOptions,
    activityOptions,
    logbookStatusOptions,
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
  }, [
    user?.id_client,
    fetchPPDSActiveOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
    fetchLogbookStatusOptions,
  ]);

  // Transform options to use name as value (since view uses text fields, not IDs)
  const ppdsNameOptions: BasicSelectOpt<string>[] = ppdsActiveOptions.map((opt) => ({
    label: String(opt.label),
    value: String(opt.label),
  }));

  const staffNameOptions: BasicSelectOpt<string>[] = staffOptions.map((opt) => ({
    label: String(opt.label),
    value: String(opt.label),
  }));

  const activityNameOptions: BasicSelectOpt<string>[] = activityOptions.map((opt) => ({
    label: String(opt.label),
    value: String(opt.label),
  }));

  const staseNameOptions: BasicSelectOpt<string>[] = staseOptions.map((opt) => ({
    label: String(opt.label),
    value: String(opt.label),
  }));

  const logbookStatusNameOptions: BasicSelectOpt<string>[] = logbookStatusOptions.map((opt) => ({
    label: String(opt.label),
    value: String(opt.value),
  }));

  // Read current filter values from URL
  const currentFilters = useMemo(() => ({
    ppds_name: searchParams.get("ppds_name") || undefined,
    staff_name: searchParams.get("staff_name") || undefined,
    activity_name: searchParams.get("activity_name") || undefined,
    stase_name: searchParams.get("stase_name") || undefined,
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
    status: searchParams.get("status") || undefined,
  }), [searchParams]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "ppds_name",
      label: "PPDS",
      type: "select",
      options: ppdsNameOptions,
      placeholder: "Pilih PPDS...",
    },
    {
      key: "staff_name",
      label: "Staff",
      type: "select",
      options: staffNameOptions,
      placeholder: "Pilih Staff...",
    },
    {
      key: "activity_name",
      label: "Activity",
      type: "select",
      options: activityNameOptions,
      placeholder: "Pilih Activity...",
    },
    {
      key: "stase_name",
      label: "Stase",
      type: "select",
      options: staseNameOptions,
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
      options: logbookStatusNameOptions,
      placeholder: "Pilih Status...",
    }
  ];

  // Build sync values from URL params - these will sync when URL changes (back navigation)
  const syncValues = useMemo((): Record<string, FilterValue> | undefined => {
    const values: Record<string, FilterValue> = {};

    // PPDS option from URL (string-based, value = label)
    if (currentFilters.ppds_name) {
      const ppdsOpt = ppdsNameOptions.find(opt => opt.value === currentFilters.ppds_name);
      if (ppdsOpt) values.ppds_name = ppdsOpt;
    }
    // Staff option from URL (string-based, value = label)
    if (currentFilters.staff_name) {
      const staffOpt = staffNameOptions.find(opt => opt.value === currentFilters.staff_name);
      if (staffOpt) values.staff_name = staffOpt;
    }
    // Activity option from URL (string-based, value = label)
    if (currentFilters.activity_name) {
      const activityOpt = activityNameOptions.find(opt => opt.value === currentFilters.activity_name);
      if (activityOpt) values.activity_name = activityOpt;
    }
    // Stase option from URL (string-based, value = label)
    if (currentFilters.stase_name) {
      const staseOpt = staseNameOptions.find(opt => opt.value === currentFilters.stase_name);
      if (staseOpt) values.stase_name = staseOpt;
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

    // Status option from URL (string-based, value = label)
    if (currentFilters.status) {
      const statusOpt = logbookStatusNameOptions.find(opt => opt.value === currentFilters.status);
      if (statusOpt) values.status = statusOpt;
    }

    return Object.keys(values).length > 0 ? values : undefined;
  }, [currentFilters, ppdsNameOptions, staffNameOptions, activityNameOptions, staseNameOptions, logbookStatusNameOptions]);

  // Helper to get string value from select option
  const getSelectValue = (key: string, data: Record<string, FilterValue>): string | null => {
    const val = data[key];
    if (val && typeof val === "object" && "value" in val) {
      return (val as { value: string }).value ?? null;
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
      ppds_name: getSelectValue("ppds_name", data),
      staff_name: getSelectValue("staff_name", data),
      activity_name: getSelectValue("activity_name", data),
      stase_name: getSelectValue("stase_name", data),
      start_date: getDateValue("start_date", data),
      end_date: getDateValue("end_date", data),
      status: getSelectValue("status", data),
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