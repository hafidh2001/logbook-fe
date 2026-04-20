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
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "", label: "Semua Role" },
      { value: "staff", label: "Staff" },
      { value: "dpjp", label: "DPJP" },
    ],
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
