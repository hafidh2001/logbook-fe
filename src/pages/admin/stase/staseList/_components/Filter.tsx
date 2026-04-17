import { FilterPanel } from "@/components/filter";
import type { FilterFieldConfig, FilterProps } from "@/components/filter";

const filterFields: FilterFieldConfig[] = [
  {
    key: "user",
    label: "User",
    type: "input",
    placeholder: "Cari user...",
  },
  {
    key: "stase",
    label: "Stase",
    type: "input",
    placeholder: "Cari stase...",
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
