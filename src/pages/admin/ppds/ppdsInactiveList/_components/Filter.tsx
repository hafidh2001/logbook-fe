import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";

const filterFields: FilterFieldConfig[] = [
  {
    key: "nama",
    label: "Nama",
    type: "input",
    placeholder: "Cari nama...",
  },
  {
    key: "stase",
    label: "Stase",
    type: "select",
    options: [
      { value: "", label: "Semua Stase" },
      { value: "RSO OTK", label: "RSO OTK" },
    ],
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
