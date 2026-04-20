import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";

const filterFields: FilterFieldConfig[] = [
  {
    key: "ppds",
    label: "PPDS",
    type: "input",
    placeholder: "Cari PPDS...",
  },
  {
    key: "stase",
    label: "Stase",
    type: "input",
    placeholder: "Cari stase...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "Semua Status" },
      { value: "verified", label: "Terverifikasi" },
      { value: "pending", label: "Menunggu" },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    type: "input",
    placeholder: "Cari activity...",
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
