import { FilterPanel } from "@/components/filterPanel/filter";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel/filter";

const filterFields: FilterFieldConfig[] = [
  {
    key: "ppds",
    label: "PPDS",
    type: "input",
    placeholder: "Cari PPDS...",
  },
  {
    key: "stage",
    label: "Stage",
    type: "input",
    placeholder: "Cari stage...",
  },
  {
    key: "semester",
    label: "Semester",
    type: "input",
    placeholder: "Cari semester...",
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
