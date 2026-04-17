import { FilterPanel } from "@/components/filterPanel/filter";
import type { FilterFieldConfig, FilterProps } from "@/components/filterPanel/filter";

const filterFields: FilterFieldConfig[] = [
  {
    key: "nama",
    label: "Nama",
    type: "input",
    placeholder: "Cari nama...",
  },
  {
    key: "stage",
    label: "Stage",
    type: "select",
    options: [
      { value: "", label: "Semua Stage" },
      { value: "Radiologi", label: "Radiologi" },
      { value: "Stase Rekon I", label: "Stase Rekon I" },
      { value: "Stase Rekon II", label: "Stase Rekon II" },
      { value: "ICU", label: "ICU" },
      { value: "OK", label: "OK" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "Semua Status" },
      { value: "aktif", label: "Aktif" },
      { value: "nonaktif", label: "Nonaktif" },
    ],
  },
  {
    key: "jenisKelamin",
    label: "Jenis Kelamin",
    type: "select",
    options: [
      { value: "", label: "Semua" },
      { value: "laki-laki", label: "Laki-laki" },
      { value: "perempuan", label: "Perempuan" },
    ],
  },
  {
    key: "stase",
    label: "Stase",
    type: "multiSelect",
    options: [
      { value: "radiologi", label: "Radiologi" },
      { value: "rekon1", label: "Stase Rekon I" },
      { value: "rekon2", label: "Stase Rekon II" },
      { value: "icu", label: "ICU" },
      { value: "ok", label: "OK" },
    ],
  },
  {
    key: "tanggalLahir",
    label: "Tanggal Lahir",
    type: "calendar",
  },
  {
    key: "bulanMasuk",
    label: "Bulan Masuk",
    type: "monthYear",
  },
  {
    key: "isVerified",
    label: "Terverifikasi",
    type: "checkbox",
  },
];

export const Filter = (props: Omit<FilterProps, "fields">) => {
  return <FilterPanel fields={filterFields} {...props} />;
};
