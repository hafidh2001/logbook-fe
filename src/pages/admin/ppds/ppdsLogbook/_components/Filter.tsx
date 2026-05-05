import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";

export const Filter = ({
  initialPpdsId,
  ...props
}: Omit<FilterProps, "fields"> & {
  initialPpdsId?: number;
}) => {
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
  }, [user?.id_client, fetchPPDSActiveOptions, fetchStaffOptions, fetchStaseOptions, fetchActivityOptions, fetchLogbookStatusOptions]);

  // Find the PPDS option that matches initialPpdsId to get correct label
  const initialPpdsOption = useMemo(() => {
    if (!initialPpdsId) return undefined;
    return ppdsActiveOptions.find(opt => opt.value === initialPpdsId);
  }, [initialPpdsId, ppdsActiveOptions]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "id_ppds",
      label: "PPDS",
      type: "select",
      options: ppdsActiveOptions,
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

  const initialValues = initialPpdsOption
    ? { id_ppds: initialPpdsOption }
    : undefined;

  return (
    <FilterPanel
      fields={filterFields}
      {...props}
      initialValues={initialValues}
    />
  );
};
