import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";
import type { BasicSelectOpt } from "@/types";
import { useEffect } from "react";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";

export const Filter = (props: Omit<FilterProps, "fields">) => {
  const {
    ppdsOptions,
    staffOptions,
    staseOptions,
    activityOptions,
    fetchPPDSOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
  } = useMasterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSOptions({ id_client: user.id_client });
      fetchStaffOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
      fetchActivityOptions({ id_client: user.id_client });
    }
  }, [
    user?.id_client,
    fetchPPDSOptions,
    fetchStaffOptions,
    fetchStaseOptions,
    fetchActivityOptions,
  ]);

  // Transform options to use name as value (since view uses text fields, not IDs)
  const ppdsNameOptions: BasicSelectOpt<string>[] = ppdsOptions.map((opt) => ({
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
  ];

  return <FilterPanel fields={filterFields} {...props} />;
};
