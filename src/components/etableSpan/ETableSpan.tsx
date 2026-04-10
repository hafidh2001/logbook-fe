import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Pagination } from "./Pagination";

// Multi-level column definition
export type MultiLevelColumn<T> = {
  accessorKey: keyof T | string;
  header: string;
  size?: number;
  minSize?: number;
  maxSize?: number;
  justify?: "start" | "center" | "end";
  cell?: (props: { row: { original: T }; getValue: () => any }) => React.ReactNode;
  columns?: MultiLevelColumn<T>[]; // For nested columns
};

interface ETableSpanProps<T extends Record<string, any>> {
  data: T[];
  columns: MultiLevelColumn<T>[];
  pagination?: {
    enabled: boolean;
    initialPageIndex?: number;
    initialPageSize?: number;
    mode?: "client" | "server";
  };
  isShowNumbering?: boolean;
  isLoading?: boolean;
  noDataText?: string;
  className?: string;
  meta?: {
    page: number;
    offset: number;
    pageCount?: number;
  };
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

// Helper to flatten columns for TanStack Table
function flattenColumns<T>(columns: MultiLevelColumn<T>[]): any[] {
  const result: any[] = [];

  columns.forEach((col) => {
    if (col.columns && col.columns.length > 0) {
      // Has nested columns - flatten them
      result.push(...flattenColumns(col.columns));
    } else {
      // Leaf column
      result.push({
        accessorKey: col.accessorKey,
        id: String(col.accessorKey),
        header: col.header,
        size: col.size,
        minSize: col.minSize,
        maxSize: col.maxSize,
        cell: col.cell || ((props: any) => props.getValue()),
      });
    }
  });

  return result;
}

// Helper to calculate header structure (rowspan/colspan)
type HeaderCell = {
  label: string;
  colspan: number;
  rowspan: number;
  column?: MultiLevelColumn<any>;
};

function calculateHeaderStructure<T>(
  columns: MultiLevelColumn<T>[],
  maxDepth: number
): HeaderCell[][] {
  const rows: HeaderCell[][] = Array.from({ length: maxDepth }, () => []);

  function processColumn(
    col: MultiLevelColumn<T>,
    depth: number
  ) {
    if (col.columns && col.columns.length > 0) {
      // Parent header with children
      const childrenCount = col.columns.reduce((sum, child) => {
        return sum + (child.columns && child.columns.length > 0 ? child.columns.length : 1);
      }, 0);

      rows[depth].push({
        label: col.header,
        colspan: childrenCount,
        rowspan: 1,
        column: col,
      });

      // Process children
      col.columns.forEach((child) => {
        processColumn(child, depth + 1);
      });
    } else {
      // Leaf column - calculate rowspan
      const rowspan = maxDepth - depth;
      rows[depth].push({
        label: col.header,
        colspan: 1,
        rowspan: rowspan,
        column: col,
      });
    }
  }

  columns.forEach((col) => processColumn(col, 0));

  return rows;
}

// Helper to get max depth of columns
function getMaxDepth<T>(columns: MultiLevelColumn<T>[]): number {
  let maxDepth = 1;

  function traverse(cols: MultiLevelColumn<T>[], depth: number) {
    cols.forEach((col) => {
      if (col.columns && col.columns.length > 0) {
        traverse(col.columns, depth + 1);
      } else {
        maxDepth = Math.max(maxDepth, depth);
      }
    });
  }

  traverse(columns, 1);
  return maxDepth;
}

export const ETableSpan = <T extends Record<string, any>>(
  opt: ETableSpanProps<T>
) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const initialPagination = {
    pageIndex: opt.pagination?.initialPageIndex || 0,
    pageSize: opt.pagination?.initialPageSize || 10,
  };

  const [pagination, setPagination] = useState(initialPagination);

  // Reset pagination when initialPageIndex changes (for server-side pagination)
  useEffect(() => {
    if (
      opt.pagination?.mode === "server" &&
      opt.pagination?.initialPageIndex !== undefined
    ) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: opt.pagination!.initialPageIndex!,
        pageSize: opt.pagination?.initialPageSize || prev.pageSize,
      }));
    }
  }, [opt.pagination?.initialPageIndex, opt.pagination?.initialPageSize]);

  const div = useRef<HTMLDivElement>(null);
  const tbody = useRef<HTMLTableSectionElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Process columns with numbering if needed
  const processedColumns = useMemo<MultiLevelColumn<T>[]>(() => {
    let cols = [...opt.columns];

    if (opt.isShowNumbering) {
      const numberingColumn: MultiLevelColumn<T> = {
        accessorKey: "no",
        header: "No.",
        size: 60,
        minSize: 60,
        maxSize: 60,
        cell: (context: any) => {
          if (opt.meta?.offset !== undefined && !isNaN(opt.meta.offset)) {
            const rowNumber = opt.meta.offset + context.row.index + 1;
            return <span className="text-sm font-medium">{rowNumber}</span>;
          }

          const { pageIndex = 0, pageSize = 10 } =
            context.table?.getState().pagination || {};
          const rowNumber = pageIndex * pageSize + context.row.index + 1;

          return <span className="text-sm font-medium">{rowNumber}</span>;
        },
      };

      cols = [numberingColumn, ...cols];
    }

    return cols;
  }, [opt.columns, opt.isShowNumbering, opt.meta]);

  // Flatten columns for TanStack Table
  const flatColumns = useMemo(
    () => flattenColumns(processedColumns),
    [processedColumns]
  );

  // Calculate header structure
  const maxDepth = useMemo(() => getMaxDepth(processedColumns), [processedColumns]);
  const headerRows = useMemo(
    () => calculateHeaderStructure(processedColumns, maxDepth),
    [processedColumns, maxDepth]
  );

  // Determine pagination mode
  const isServerPagination =
    opt.pagination?.mode === "server" ||
    (opt.pagination?.mode !== "client" && !!opt.onPaginationChange);

  const table = useReactTable({
    data: opt.data as any,
    columns: flatColumns,
    state: {
      pagination: opt.pagination?.enabled ? pagination : undefined,
      rowSelection,
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newState);

      if (isServerPagination && opt.onPaginationChange) {
        opt.onPaginationChange(newState.pageIndex, newState.pageSize);
      }
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: opt.pagination?.enabled
      ? getPaginationRowModel()
      : undefined,
    manualPagination: isServerPagination,
    autoResetPageIndex: !isServerPagination,
    getRowId: (row, index) => {
      // @ts-ignore
      return row.id?.toString() || index.toString();
    },
    pageCount: isServerPagination ? opt.meta?.pageCount || -1 : undefined,
  });

  useEffect(() => {
    if (!div.current) return;

    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        void entry.contentRect.height;
      }
    });

    observerRef.current.observe(div.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full h-full relative border rounded-lg overflow-hidden",
        opt.className
      )}
      ref={div}
    >
      <div className="absolute inset-0 flex flex-col">
        {flatColumns.length > 0 && (
          <>
            <div className="flex-1 overflow-auto relative">
              {/* Loading overlay */}
              {opt.isLoading && table.getRowModel().rows?.length > 0 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-600"></div>
                    <span className="text-sm font-medium text-slate-600">
                      Loading...
                    </span>
                  </div>
                </div>
              )}
              <Table
                className="w-full"
                key={`table-${table.getState().pagination?.pageIndex || 0}-${
                  table.getState().pagination?.pageSize || 10
                }`}
              >
                <TableHeader className="sticky top-0 z-10 bg-slate-50">
                  {/* Render multi-level headers */}
                  {headerRows.map((row, rowIndex) => (
                    <TableRow
                      key={`header-row-${rowIndex}`}
                      className="border-b border-slate-200"
                    >
                      {row.map((cell, cellIndex) => {
                        const columnSize = cell.column?.size;
                        const columnMinSize = cell.column?.minSize;
                        const columnMaxSize = cell.column?.maxSize;

                        const getDefaultWidth = () => {
                          const accessorKey = cell.column?.accessorKey;
                          if (accessorKey === "no") return "60px";
                          return "auto";
                        };

                        const finalWidth = columnSize
                          ? `${columnSize}px`
                          : getDefaultWidth();

                        return (
                          <TableHead
                            key={`header-${rowIndex}-${cellIndex}`}
                            className={cn(
                              "bg-slate-50 text-slate-700 font-semibold border-r border-slate-200 last:border-r-0 h-12 px-4 text-center"
                            )}
                            style={{
                              width: cell.colspan === 1 ? finalWidth : undefined,
                              minWidth: columnMinSize
                                ? `${columnMinSize}px`
                                : undefined,
                              maxWidth: columnMaxSize
                                ? `${columnMaxSize}px`
                                : undefined,
                            }}
                            colSpan={cell.colspan}
                            rowSpan={cell.rowspan}
                          >
                            {cell.label}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="bg-white" ref={tbody}>
                  {table.getRowModel().rows?.length ? (
                    <Fragment>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className={cn(
                            "border-b border-slate-200 hover:bg-slate-50 transition-colors"
                          )}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const columnJustify =
                              (cell.column.columnDef as any).justify || "start";

                            const getCellTextAlignClass = (justify: string) => {
                              switch (justify) {
                                case "center":
                                  return "text-center";
                                case "end":
                                  return "text-right";
                                case "start":
                                default:
                                  return "text-left";
                              }
                            };

                            const cellTextAlignClass =
                              getCellTextAlignClass(columnJustify);

                            return (
                              <TableCell
                                key={cell.id}
                                className={cn(
                                  "py-3 px-4 border-r border-slate-200 last:border-r-0",
                                  cellTextAlignClass,
                                  cell.column.id === "no" && "text-center"
                                )}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </Fragment>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={flatColumns.length}
                        className="h-24 text-center text-slate-500 whitespace-normal"
                        style={{ minWidth: "auto" }}
                      >
                        {opt.isLoading ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
                            <span className="text-sm font-medium">
                              Loading data...
                            </span>
                          </div>
                        ) : (
                          opt.noDataText || "No data available"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {opt.pagination?.enabled && (
              <div className="flex-shrink-0 bg-white border-t border-slate-200">
                <Pagination
                  pageIndex={table.getState().pagination?.pageIndex || 0}
                  pageCount={table.getPageCount()}
                  canPreviousPage={table.getCanPreviousPage()}
                  canNextPage={table.getCanNextPage()}
                  setPageIndex={(pageIndex) => {
                    table.setPageIndex(pageIndex);
                  }}
                  setPageSize={(pageSize) => {
                    table.setPageSize(pageSize);
                  }}
                  pageSize={table.getState().pagination?.pageSize || 10}
                  isLoading={opt.isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
