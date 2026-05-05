import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";
import { useEffect } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";

export const Filter = (props: Omit<FilterProps, "fields">) => {
  const {
    ppdsOptions,
    staffOptions,
    staseOptions,
    fetchPPDSOptions,
    fetchStaffOptions,
    fetchStaseOptions,
  } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSOptions({ id_client: user.id_client });
      fetchStaffOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchPPDSOptions, fetchStaffOptions, fetchStaseOptions]);

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

  return <FilterPanel fields={filterFields} {...props} />;
};
