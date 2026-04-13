import { useState, useMemo } from "react";
import { SingleSelect } from "@/components/fields/singleSelect";
import { MultipleSelect } from "@/components/fields/multipleSelect";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { MonthYearSelect } from "@/components/fields/monthYearSelect";
import { CheckboxLabel } from "@/components/fields/checkboxLabel";
import { BasicSelectOpt } from "@/types";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Filter field types
type FilterFieldType = "select" | "multiSelect" | "input" | "calendar" | "monthYear" | "checkbox";

type FilterFieldConfig = {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: BasicSelectOpt<string>[];
  placeholder?: string;
};

// Filter state type - can hold different value types
type FilterValue = BasicSelectOpt<string | number> | BasicSelectOpt<string | number>[] | string | Date | boolean | null | undefined;

type FilterProps = {
  onSearch: (data: Record<string, FilterValue>) => void;
  onReset: () => void;
  resultCount?: number;
};

// Filter fields configuration - mudah ditambah/dikurangi
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

// Helper to check if filter has value
const hasFilterValue = (value: FilterValue, type: FilterFieldType): boolean => {
  if (value === null || value === undefined) return false;
  if (type === "checkbox") return value === true;
  if (type === "input") return value !== "";
  if (type === "calendar" || type === "monthYear") return value instanceof Date;
  if (type === "select") return (value as BasicSelectOpt<string | number>)?.value !== "";
  if (type === "multiSelect") return Array.isArray(value) && value.length > 0;
  return false;
};

// Helper to get display value for chip
const getChipLabel = (value: FilterValue, type: FilterFieldType): string => {
  if (type === "checkbox") return value ? "Ya" : "Tidak";
  if (type === "input") return String(value);
  if (type === "calendar" || type === "monthYear") {
    return value instanceof Date ? value.toLocaleDateString("id-ID") : "";
  }
  if (type === "select") return String((value as BasicSelectOpt<string | number>)?.label || "");
  if (type === "multiSelect") return (value as BasicSelectOpt<string | number>[])?.map(v => v.label).join(", ") || "";
  return "";
};

export const Filter = ({ onSearch, onReset, resultCount }: FilterProps) => {
  // State untuk setiap filter
  const [filters, setFilters] = useState<Record<string, FilterValue>>(() =>
    filterFields.reduce(
      (acc, field) => {
        // Set default values based on type
        switch (field.type) {
          case "multiSelect":
            acc[field.key] = [];
            break;
          case "checkbox":
            acc[field.key] = false;
            break;
          case "input":
            acc[field.key] = "";
            break;
          case "calendar":
          case "monthYear":
            acc[field.key] = null;
            break;
          default:
            acc[field.key] = null;
        }
        return acc;
      },
      {} as Record<string, FilterValue>,
    ),
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Hitung jumlah filter yang aktif
  const activeFilterCount = useMemo(() => {
    return filterFields.filter((field) => hasFilterValue(filters[field.key], field.type)).length;
  }, [filters]);

  // Ambil chips untuk display (hanya yang aktif)
  const activeFilterChips = useMemo(() => {
    return filterFields
      .filter((field) => hasFilterValue(filters[field.key], field.type))
      .map((field) => ({
        key: field.key,
        label: field.label,
        value: filters[field.key],
        type: field.type,
        displayValue: getChipLabel(filters[field.key], field.type),
      }));
  }, [filters]);

  const handleFilterChange = (key: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveChip = (key: string) => {
    const field = filterFields.find(f => f.key === key);
    if (field) {
      // Reset to default value
      switch (field.type) {
        case "multiSelect":
          handleFilterChange(key, []);
          break;
        case "checkbox":
          handleFilterChange(key, false);
          break;
        case "input":
          handleFilterChange(key, "");
          break;
        default:
          handleFilterChange(key, null);
      }
    }
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setFilters(
      filterFields.reduce(
        (acc, field) => {
          switch (field.type) {
            case "multiSelect":
              acc[field.key] = [];
              break;
            case "checkbox":
              acc[field.key] = false;
              break;
            case "input":
              acc[field.key] = "";
              break;
            default:
              acc[field.key] = null;
          }
          return acc;
        },
        {} as Record<string, FilterValue>,
      ),
    );
    onReset();
  };

  // Render field berdasarkan type
  const renderField = (field: FilterFieldConfig) => {
    const value = filters[field.key];

    switch (field.type) {
      case "select":
        return (
          <SingleSelect
            key={field.key}
            options={field.options || []}
            value={value as BasicSelectOpt<string> | null}
            onChange={(option) => handleFilterChange(field.key, option as FilterValue)}
            isSearchable
            placeholder={field.placeholder || `Pilih ${field.label}...`}
            selectClassName="w-full"
          />
        );

      case "multiSelect":
        return (
          <MultipleSelect
            key={field.key}
            options={field.options || []}
            value={value as BasicSelectOpt<string>[]}
            onChange={(option) => handleFilterChange(field.key, option as FilterValue)}
            isSearchable
            placeholder={field.placeholder || `Pilih ${field.label}...`}
            selectClassName="w-full"
          />
        );

      case "input":
        return (
          <InputField
            key={field.key}
            value={value as string}
            onChange={(val) => handleFilterChange(field.key, val)}
            placeholder={field.placeholder || `Masukkan ${field.label}...`}
            containerClassName="w-full"
          />
        );

      case "calendar":
        return (
          <CalendarSelect
            key={field.key}
            value={value as Date | undefined}
            onChange={(val) => handleFilterChange(field.key, val as FilterValue)}
            placeholder={field.placeholder || `Pilih ${field.label}...`}
            containerClassName="w-full"
          />
        );

      case "monthYear":
        return (
          <MonthYearSelect
            key={field.key}
            value={value as Date | undefined}
            onChange={(val) => handleFilterChange(field.key, val as FilterValue)}
            placeholder={field.placeholder || `Pilih ${field.label}...`}
            containerClassName="w-full"
          />
        );

      case "checkbox":
        return (
          <div key={field.key} className="py-2">
            <CheckboxLabel
              checked={value as boolean}
              onCheckedChange={(val) => handleFilterChange(field.key, val)}
              label={field.label}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar Row - selalu visible */}
      <div className="flex justify-end items-center gap-2">
        {/* Left side - Result count (when shown, pushed to left by margin-auto) */}
        {resultCount !== undefined && (
          <div className="text-sm text-gray-600 mr-auto">
            Menampilkan{" "}
            <span className="font-medium text-gray-900">{resultCount}</span>{" "}
            data
          </div>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsFilterOpen(true)}>
            <icons.Filter size={16} />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-end">
          {activeFilterChips.map((chip) => (
            <div
              key={chip.key}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
            >
              <span className="font-medium">{chip.label}:</span>
              <span>{chip.displayValue}</span>
              <button
                onClick={() => handleRemoveChip(chip.key)}
                className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
              >
                <icons.X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter Sheet/Panel */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="flex flex-col h-full w-full sm:max-w-md">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Filter</SheetTitle>
            <SheetDescription>
              Pilih kriteria filter untuk menampilkan data yang sesuai
            </SheetDescription>
          </SheetHeader>

          {/* Filter Fields Grid - scrollable */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-1 gap-4 px-[2px]">
              {filterFields.map((field) => renderField(field))}
            </div>
          </div>

          <SheetFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={handleReset}>
                <icons.RotateCcw size={16} />
                <span>Reset</span>
              </Button>
              <Button variant="default" onClick={handleSearch}>
                <icons.Search size={16} />
                <span>Terapkan</span>
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
