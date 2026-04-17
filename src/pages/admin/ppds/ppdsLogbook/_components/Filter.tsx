import { FilterPanel } from "@/components/filterPanel/filter";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel/filter";

const filterFields: FilterFieldConfig[] = [
  {
    key: "activity",
    label: "Activity",
    type: "input",
    placeholder: "Cari activity...",
  },
  {
    key: "staffPengajar",
    label: "Staff Pengajar",
    type: "input",
    placeholder: "Cari staff pengajar...",
  },
  {
    key: "hospital",
    label: "Hospital",
    type: "input",
    placeholder: "Cari hospital...",
  },
  {
    key: "verifiedStatus",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "Semua Status" },
      { value: "verified", label: "Terverifikasi" },
      { value: "pending", label: "Menunggu" },
    ],
  },
  {
    key: "date",
    label: "Tanggal",
    type: "calendar",
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
