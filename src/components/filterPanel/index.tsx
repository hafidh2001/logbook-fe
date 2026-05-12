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
  disabled?: boolean;
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
  // Applied filters - these are what show in chips and are sent to API
  const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue>>(() =>
    fields.reduce(
      (acc, field) => {
        acc[field.key] = initialValues?.[field.key] ?? getDefaultValue(field.type);
        return acc;
      },
      {} as Record<string, FilterValue>
    )
  );

  // Draft filters - temporary state while user is selecting in the panel
  const [draftFilters, setDraftFilters] = useState<Record<string, FilterValue>>(() =>
    fields.reduce(
      (acc, field) => {
        acc[field.key] = initialValues?.[field.key] ?? getDefaultValue(field.type);
        return acc;
      },
      {} as Record<string, FilterValue>
    )
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync applied filters when initialValues or syncValues changes (from URL/external)
  useEffect(() => {
    const valuesToSync = syncValues ?? initialValues;
    if (valuesToSync) {
      setAppliedFilters((prev) => {
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
      // Also sync draft filters so panel shows current applied values when opened
      setDraftFilters((prev) => {
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

  // Open panel - load applied filters into draft
  // Close panel - discard draft, restore to applied (unless Terapkan was clicked)
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Opening - load current applied values into draft
      setDraftFilters(appliedFilters);
    } else {
      // Closing without Terapkan - discard draft
      setDraftFilters(appliedFilters);
    }
    setIsFilterOpen(open);
  };

  // Hitung jumlah filter yang aktif (based on applied, not draft)
  const activeFilterCount = useMemo(() => {
    return fields.filter((field) =>
      hasFilterValue(appliedFilters[field.key], field.type)
    ).length;
  }, [fields, appliedFilters]);

  // Ambil chips untuk display (hanya yang aktif - based on applied)
  const activeFilterChips = useMemo(() => {
    return fields
      .filter((field) => hasFilterValue(appliedFilters[field.key], field.type))
      .map((field) => ({
        key: field.key,
        label: field.label,
        value: appliedFilters[field.key],
        type: field.type,
        displayValue: getChipLabel(appliedFilters[field.key], field.type),
        disabled: field.disabled,
      }));
  }, [fields, appliedFilters]);

  const handleFilterChange = (key: string, value: FilterValue) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveChip = (key: string) => {
    const field = fields.find((f) => f.key === key);
    if (field) {
      const newFilters = { ...appliedFilters, [key]: getDefaultValue(field.type) };
      setAppliedFilters(newFilters);
      setDraftFilters(newFilters);
      onSearch(newFilters);
    }
  };

  const handleSearch = () => {
    // Commit draft to applied
    setAppliedFilters(draftFilters);
    onSearch(draftFilters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    const resetFilters = fields.reduce(
      (acc, field) => {
        // Preserve disabled field values during reset
        if (field.disabled) {
          acc[field.key] = appliedFilters[field.key];
        } else {
          acc[field.key] = getDefaultValue(field.type);
        }
        return acc;
      },
      {} as Record<string, FilterValue>
    );
    setDraftFilters(resetFilters);
    onReset();
  };

  // Render field berdasarkan type (uses draftFilters for panel selections)
  const renderField = (field: FilterFieldConfig) => {
    const value = draftFilters[field.key];

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
            disabled={field.disabled}
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
              {!chip.disabled && (
                <button
                  onClick={() => handleRemoveChip(chip.key)}
                  className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                >
                  <icons.X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filter Sheet/Panel */}
      <Sheet open={isFilterOpen} onOpenChange={handleOpenChange}>
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
