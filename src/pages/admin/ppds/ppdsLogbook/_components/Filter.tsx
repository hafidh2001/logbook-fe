import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";
import { useEffect, useMemo } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router-dom";

export const Filter = ({
  initialPpdsId,
  ...props
}: Omit<FilterProps, "fields"> & {
  initialPpdsId?: number;
}) => {
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
