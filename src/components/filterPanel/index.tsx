import { useState, useMemo, useEffect } from "react";
import { SingleSelect } from "@/components/fields/singleSelect";
import { MultipleSelect } from "@/components/fields/multipleSelect";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { MonthYearSelect } from "@/components/fields/monthYearSelect";
import { CheckboxLabel } from "@/components/fields/checkboxLabel";
import { BasicSelectOpt } from "@/types";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import { getMonth } from "@/functions/getMonth";
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
export type FilterFieldType =
  | "select"
  | "multiSelect"
  | "input"
  | "calendar"
  | "monthYear"
  | "checkbox";

export type FilterFieldConfig = {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: BasicSelectOpt<string | number>[];
  placeholder?: string;
};

// Filter state type - can hold different value types
export type FilterValue =
  | BasicSelectOpt<string | number>
  | BasicSelectOpt<string | number>[]
  | string
  | number
  | Date
  | boolean
  | null
  | undefined;

export type FilterProps = {
  fields: FilterFieldConfig[];
  onSearch: (data: Record<string, FilterValue>) => void;
  onReset: () => void;
  resultCount?: number;
  initialValues?: Record<string, FilterValue>;
  /** External filter values to watch and sync - when these change externally, internal state updates */
  syncValues?: Record<string, FilterValue>;
};

// Helper to check if filter has value
const hasFilterValue = (value: FilterValue, type: FilterFieldType): boolean => {
  if (value === null || value === undefined) return false;
  if (type === "checkbox") return value === true;
  if (type === "input") return value !== "";
  if (type === "calendar" || type === "monthYear") return value instanceof Date;
  if (type === "select")
    return (value as BasicSelectOpt<string | number>)?.value !== "";
  if (type === "multiSelect")
    return Array.isArray(value) && value.length > 0;
  return false;
};

// Helper to get display value for chip
const getChipLabel = (value: FilterValue, type: FilterFieldType): string => {
  if (type === "checkbox") return value ? "Ya" : "Tidak";
  if (type === "input") return String(value);
  if (type === "calendar" && value instanceof Date) {
    // Format: "04 Agustus, 2026"
    const day = String(value.getDate()).padStart(2, "0");
    const month = getMonth(value.getMonth() + 1, "id", "MMMM");
    const year = value.getFullYear();
    return `${day} ${month}, ${year}`;
  }
  if (type === "monthYear" && value instanceof Date) {
    // Format: "Agustus, 2026"
    const month = getMonth(value.getMonth() + 1, "id", "MMMM");
    const year = value.getFullYear();
    return `${month}, ${year}`;
  }
  if (type === "select")
    return String(
      (value as BasicSelectOpt<string | number>)?.label || ""
    );
  if (type === "multiSelect")
    return (value as BasicSelectOpt<string | number>[])
      ?.map((v) => v.label)
      .join(", ") || "";
  return "";
};

// Get default value for a field type
const getDefaultValue = (type: FilterFieldType): FilterValue => {
  switch (type) {
    case "multiSelect":
      return [];
    case "checkbox":
      return false;
    case "input":
      return "";
    case "calendar":
    case "monthYear":
      return null;
    default:
      return null;
  }
};

export function FilterPanel({ fields, onSearch, onReset, resultCount, initialValues, syncValues }: FilterProps) {
  // State untuk setiap filter
  const [filters, setFilters] = useState<Record<string, FilterValue>>(() =>
    fields.reduce(
      (acc, field) => {
        acc[field.key] = initialValues?.[field.key] ?? getDefaultValue(field.type);
        return acc;
      },
      {} as Record<string, FilterValue>
    )
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync filters when initialValues or syncValues changes
  useEffect(() => {
    const valuesToSync = syncValues ?? initialValues;
    if (valuesToSync) {
      setFilters((prev) => {
        let hasUpdates = false;
        const newFilters = { ...prev };
        Object.entries(valuesToSync).forEach(([key, value]) => {
          if (prev[key] !== value) {
            newFilters[key] = value;
            hasUpdates = true;
          }
        });
        return hasUpdates ? newFilters : prev;
      });
    }
  }, [syncValues, initialValues]);

  // Hitung jumlah filter yang aktif
  const activeFilterCount = useMemo(() => {
    return fields.filter((field) =>
      hasFilterValue(filters[field.key], field.type)
    ).length;
  }, [fields, filters]);

  // Ambil chips untuk display (hanya yang aktif)
  const activeFilterChips = useMemo(() => {
    return fields
      .filter((field) => hasFilterValue(filters[field.key], field.type))
      .map((field) => ({
        key: field.key,
        label: field.label,
        value: filters[field.key],
        type: field.type,
        displayValue: getChipLabel(filters[field.key], field.type),
      }));
  }, [fields, filters]);

  const handleFilterChange = (key: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveChip = (key: string) => {
    const field = fields.find((f) => f.key === key);
    if (field) {
      const newFilters = { ...filters, [key]: getDefaultValue(field.type) };
      setFilters(newFilters);
      onSearch(newFilters);
    }
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setFilters(
      fields.reduce(
        (acc, field) => {
          acc[field.key] = getDefaultValue(field.type);
          return acc;
        },
        {} as Record<string, FilterValue>
      )
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
            onChange={(option) =>
              handleFilterChange(field.key, option as FilterValue)
            }
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
            onChange={(option) =>
              handleFilterChange(field.key, option as FilterValue)
            }
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
            onChange={(val) =>
              handleFilterChange(field.key, val as FilterValue)
            }
            placeholder={field.placeholder || `Pilih ${field.label}...`}
            containerClassName="w-full"
          />
        );

      case "monthYear":
        return (
          <MonthYearSelect
            key={field.key}
            value={value as Date | undefined}
            onChange={(val) =>
              handleFilterChange(field.key, val as FilterValue)
            }
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
        <SheetContent
          side="right"
          className="flex flex-col h-full w-full sm:max-w-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Filter</SheetTitle>
            <SheetDescription>
              Pilih kriteria filter untuk menampilkan data yang sesuai
            </SheetDescription>
          </SheetHeader>

          {/* Filter Fields Grid - scrollable */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-1 gap-4 px-[2px]">
              {fields.map((field) => renderField(field))}
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
}
