import { useState, useMemo } from "react";
import { SingleSelect } from "@/components/fields/single-select";
import { BasicSelectOpt } from "@/types";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type FilterFieldConfig = {
  key: string;
  label: string;
  options: BasicSelectOpt<string>[];
};

type FilterProps = {
  onSearch: (data: Record<string, BasicSelectOpt<string> | null>) => void;
  onReset: () => void;
  resultCount?: number;
};

// Filter fields configuration - mudah ditambah/dikurangi
const filterFields: FilterFieldConfig[] = [
  {
    key: "stage",
    label: "Stage",
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
    options: [
      { value: "", label: "Semua Status" },
      { value: "aktif", label: "Aktif" },
      { value: "nonaktif", label: "Nonaktif" },
    ],
  },
  {
    key: "jenisKelamin",
    label: "Jenis Kelamin",
    options: [
      { value: "", label: "Semua" },
      { value: "laki-laki", label: "Laki-laki" },
      { value: "perempuan", label: "Perempuan" },
    ],
  },
];

export const Filter = ({ onSearch, onReset, resultCount }: FilterProps) => {
  // State untuk setiap filter
  const [filters, setFilters] = useState<
    Record<string, BasicSelectOpt<string> | null>
  >(() =>
    filterFields.reduce(
      (acc, field) => {
        acc[field.key] = null;
        return acc;
      },
      {} as Record<string, BasicSelectOpt<string> | null>,
    ),
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Hitung jumlah filter yang aktif
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((f) => f !== null && f.value !== "")
      .length;
  }, [filters]);

  // Ambil chips untuk display (hanya yang aktif)
  const activeFilterChips = useMemo(() => {
    return filterFields
      .filter((field) => {
        const val = filters[field.key];
        return val !== null && val.value !== "";
      })
      .map((field) => ({
        key: field.key,
        label: field.label,
        value: filters[field.key]!,
      }));
  }, [filters]);

  const handleFilterChange = (
    key: string,
    value: BasicSelectOpt<string> | null,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveChip = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setFilters(
      filterFields.reduce(
        (acc, field) => {
          acc[field.key] = null;
          return acc;
        },
        {} as Record<string, BasicSelectOpt<string> | null>,
      ),
    );
    onReset();
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
              <span>{chip.value.label}</span>
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
          </SheetHeader>

          {/* Filter Fields Grid - scrollable */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-1 gap-4 px-[2px]">
              {filterFields.map((field) => (
                <SingleSelect
                  key={field.key}
                  options={field.options}
                  value={
                    filters[field.key] as BasicSelectOpt<string | number> | null
                  }
                  onChange={(option) =>
                    handleFilterChange(
                      field.key,
                      option as BasicSelectOpt<string> | null,
                    )
                  }
                  isSearchable
                  placeholder={`Pilih ${field.label}...`}
                  selectClassName="w-full"
                />
              ))}
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
