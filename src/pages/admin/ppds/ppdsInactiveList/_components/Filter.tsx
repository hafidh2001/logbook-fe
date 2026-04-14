import { useState, useMemo } from "react";
import { SingleSelect } from "@/components/fields/singleSelect";
import { InputField } from "@/components/fields/inputField";
import { BasicSelectOpt } from "@/types";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type FilterFieldType = "select" | "input";

type FilterFieldConfig = {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: BasicSelectOpt<string>[];
  placeholder?: string;
};

type FilterValue = BasicSelectOpt<string | number> | string | null | undefined;

type FilterProps = {
  onSearch: (data: Record<string, FilterValue>) => void;
  onReset: () => void;
  resultCount?: number;
};

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

const hasFilterValue = (value: FilterValue, type: FilterFieldType): boolean => {
  if (value === null || value === undefined) return false;
  if (type === "input") return value !== "";
  if (type === "select") return (value as BasicSelectOpt<string | number>)?.value !== "";
  return false;
};

const getChipLabel = (value: FilterValue, type: FilterFieldType): string => {
  if (type === "input") return String(value);
  if (type === "select") return String((value as BasicSelectOpt<string | number>)?.label || "");
  return "";
};

export const Filter = ({ onSearch, onReset, resultCount }: FilterProps) => {
  const [filters, setFilters] = useState<Record<string, FilterValue>>(() =>
    filterFields.reduce(
      (acc, field) => {
        switch (field.type) {
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    return filterFields.filter((field) => hasFilterValue(filters[field.key], field.type)).length;
  }, [filters]);

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
      if (field.type === "input") {
        handleFilterChange(key, "");
      } else {
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
          if (field.type === "input") {
            acc[field.key] = "";
          } else {
            acc[field.key] = null;
          }
          return acc;
        },
        {} as Record<string, FilterValue>,
      ),
    );
    onReset();
  };

  const renderField = (field: FilterFieldConfig) => {
    const value = filters[field.key];

    switch (field.type) {
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end items-center gap-2">
        {resultCount !== undefined && (
          <div className="text-sm text-gray-600 mr-auto">
            Menampilkan{" "}
            <span className="font-medium text-gray-900">{resultCount}</span>{" "}
            data
          </div>
        )}
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

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="flex flex-col h-full w-full sm:max-w-md">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Filter</SheetTitle>
            <SheetDescription>
              Pilih kriteria filter untuk menampilkan data yang sesuai
            </SheetDescription>
          </SheetHeader>

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