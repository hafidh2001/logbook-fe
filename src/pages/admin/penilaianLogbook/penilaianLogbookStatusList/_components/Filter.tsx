import { FilterPanel } from "@/components/filter";
import type { FilterFieldConfig, FilterProps } from "@/components/filter";

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
    key: "activity",
    label: "Activity",
    type: "input",
    placeholder: "Cari activity...",
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
