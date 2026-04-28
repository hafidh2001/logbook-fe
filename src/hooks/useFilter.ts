import { useState, useCallback } from "react";
import type { BasicSelectOpt } from "@/types";

type FilterFieldConfig = {
  key: string;
  extractValue?: (data: Record<string, unknown>) => unknown;
};

type UseFilterConfig<T extends Record<string, unknown>> = {
  /** Keys that should be included in filter params, mapped to their extraction functions */
  fields: FilterFieldConfig[];
  /** Callback to set page to 1 (provided by usePagination) */
  onFilterChange: () => void;
  /** Transform raw FilterPanel data to filter params */
  transform?: (data: Record<string, unknown>) => T;
  /** Initial filter values to set on mount */
  initialValues?: Partial<T>;
};

type UseFilterReturn<T> = {
  filterParams: T;
  handleFilterSearch: (data: Record<string, unknown>) => void;
  handleFilterReset: () => void;
  setFilterParams: (params: T) => void;
};

/**
 * Reusable filter hook that handles FilterPanel data transformation.
 * Automatically extracts values and resets pagination on filter change.
 */
const useFilter = <T extends Record<string, unknown>>(
  config: UseFilterConfig<T>
): UseFilterReturn<T> => {
  const { fields, onFilterChange, transform, initialValues } = config;

  // Default filter params - all null/undefined
  const getDefaultFilterParams = (): T => {
    const defaults: Record<string, unknown> = {};
    fields.forEach((field) => {
      defaults[field.key] = null;
    });
    return defaults as T;
  };

  // Merge initial values with defaults
  const getInitialParams = (): T => {
    const defaults = getDefaultFilterParams();
    if (initialValues) {
      return { ...defaults, ...initialValues } as T;
    }
    return defaults;
  };

  const [filterParams, setFilterParams] = useState<T>(getInitialParams());

  const handleFilterSearch = useCallback(
    (data: Record<string, unknown>) => {
      if (transform) {
        // Use custom transform function if provided
        const transformed = transform(data);
        setFilterParams(transformed);
      } else {
        // Default: extract value from each field
        const extracted: Record<string, unknown> = {};

        fields.forEach((field) => {
          const rawValue = data[field.key];

          if (field.extractValue) {
            // Use custom extraction function
            extracted[field.key] = field.extractValue(data);
          } else if (rawValue === null || rawValue === undefined) {
            // Null/undefined stays null
            extracted[field.key] = null;
          } else if (typeof rawValue === "object" && "value" in (rawValue as BasicSelectOpt<unknown>)) {
            // BasicSelectOpt format - extract value
            const selectValue = rawValue as BasicSelectOpt<unknown>;
            extracted[field.key] = selectValue.value ?? null;
          } else if (typeof rawValue === "string") {
            // String: empty string → null, otherwise keep value
            extracted[field.key] = rawValue === "" ? null : rawValue;
          } else {
            // Other types (number, boolean) - keep as is
            extracted[field.key] = rawValue;
          }
        });

        setFilterParams(extracted as T);
      }

      onFilterChange();
    },
    [fields, transform, onFilterChange]
  );

  const handleFilterReset = useCallback(() => {
    setFilterParams(getDefaultFilterParams());
    onFilterChange();
  }, [onFilterChange]);

  return {
    filterParams,
    handleFilterSearch,
    handleFilterReset,
    setFilterParams,
  };
};

export default useFilter;
