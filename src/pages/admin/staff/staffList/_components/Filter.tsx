import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";
import { useEffect } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";

export const Filter = (props: Omit<FilterProps, "fields">) => {
  const { staffOptions, staseOptions, fetchStaffOptions, fetchStaseOptions } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchStaffOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchStaffOptions, fetchStaseOptions]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "staff",
      label: "Staff",
      type: "select",
      options: staffOptions,
      placeholder: "Pilih Staff...",
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
  ];

  return <FilterPanel fields={filterFields} {...props} />;
};