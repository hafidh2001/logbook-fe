import { FilterPanel } from "@/components/filterPanel";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel";

const filterFields: FilterFieldConfig[] = [
  {
    key: "name",
    label: "Nama",
    type: "input",
    placeholder: "Cari nama...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "Semua Status" },
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "", label: "Semua Role" },
      { value: "ppds", label: "PPDS" },
      { value: "staff", label: "Staff" },
    ],
  },
  {
    key: "semester",
    label: "Semester",
    type: "input",
    placeholder: "Cari semester...",
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
