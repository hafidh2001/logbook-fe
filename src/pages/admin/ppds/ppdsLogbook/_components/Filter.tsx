import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps, FilterValue } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { BasicSelectOpt } from "@/types";

export const Filter = ({
  initialPpdsId,
  syncValues,
  ...props
}: Omit<FilterProps, "fields"> & {
  initialPpdsId?: number;
  syncValues?: Record<string, FilterValue>;
}) => {
  const {
    ppdsOptions,
    staffOptions,
    staseOptions,
    activityOptions,
    logbookStatusOptions,
    fetchPPDSOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
    fetchLogbookStatusOptions,
  } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSOptions({ id_client: user.id_client });
      fetchStaffOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
      fetchActivityOptions({ id_client: user.id_client });
      fetchLogbookStatusOptions();
    }
  }, [user?.id_client, fetchPPDSOptions, fetchStaffOptions, fetchStaseOptions, fetchActivityOptions, fetchLogbookStatusOptions]);

  // Find the PPDS option that matches initialPpdsId to get correct label
  const initialPpdsOption = useMemo(() => {
    if (!initialPpdsId) return undefined;
    return ppdsOptions.find(opt => opt.value === initialPpdsId);
  }, [initialPpdsId, ppdsOptions]);

  // Map to convert raw values to BasicSelectOpt for select fields
  const optionMapNumber: Record<string, BasicSelectOpt<number>[]> = {
    id_ppds: ppdsOptions,
    id_staff: staffOptions,
    id_activity: activityOptions,
    id_stase: staseOptions,
  };

  const optionMapString: Record<string, BasicSelectOpt<string>[]> = {
    status: logbookStatusOptions,
  };

  // Transform syncValues to BasicSelectOpt format for select fields
  const transformedSyncValues = useMemo(() => {
    if (!syncValues) return undefined;
    const result: Record<string, FilterValue> = {};
    Object.entries(syncValues).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        result[key] = value;
      } else if (typeof value === 'number' && optionMapNumber[key]) {
        // Convert raw number to BasicSelectOpt
        const option = optionMapNumber[key].find(opt => opt.value === value);
        if (option) {
          result[key] = option;
        } else {
          result[key] = { label: "", value };
        }
      } else if (typeof value === 'string' && optionMapString[key]) {
        // Convert raw string to BasicSelectOpt
        const option = optionMapString[key].find(opt => opt.value === value);
        if (option) {
          result[key] = option;
        } else {
          result[key] = { label: "", value };
        }
      } else {
        result[key] = value;
      }
    });
    return result;
  }, [syncValues, ppdsOptions, staffOptions, activityOptions, staseOptions, logbookStatusOptions]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "id_ppds",
      label: "PPDS",
      type: "select",
      options: ppdsOptions,
      placeholder: "Pilih PPDS...",
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

  const initialValues = initialPpdsOption
    ? { id_ppds: initialPpdsOption }
    : undefined;

  return (
    <FilterPanel
      fields={filterFields}
      {...props}
      initialValues={initialValues}
      syncValues={transformedSyncValues}
    />
  );
};
