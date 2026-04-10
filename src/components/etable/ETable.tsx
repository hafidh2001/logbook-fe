import { type ColumnDef } from "@tanstack/react-table";
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
  type Row,
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

// Extended ColumnDef type with alignment support
export type ExtendedColumnDef<T> = ColumnDef<T> & {
  justify?: "start" | "center" | "end";
  align?: "start" | "center" | "end";
};

type ETableState<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

// Type for simplified column definition (original style)
export type SimpleColumnDef<T, COL extends Exclude<keyof T, symbol | number>> =
  | COL
  | {
    name: COL;
    header?: ReactNode;
    render?: (opt: {
      table: ETableState<T>;
      row: T;
      index: number;
      el: {
        tbody: { current: HTMLTableSectionElement | null };
        container: { current: HTMLDivElement | null };
      };
    }) => ReactElement;
  };

// Enhanced interface based on RapidSense BaseTable
interface ETableProps<
  T extends Record<string, any>,
  COL extends Exclude<keyof T, symbol | number>
> {
  data: T[];
  columns: SimpleColumnDef<T, COL>[] | ColumnDef<T>[];
  pagination?: {
    enabled: boolean;
    initialPageIndex?: number;
    initialPageSize?: number;
    mode?: "client" | "server"; // Add mode to distinguish between client/server pagination
  };
  isShowNumbering?: boolean;
  renderExpansion?: (row: Row<T>) => ReactElement;
  isLoading?: boolean;
  hideColumns?: string[];
  onRowClick?: (row: Row<T>) => void;
  noDataText?: string;
  className?: string;
  meta?: {
    page: number;
    offset: number;
    pageCount?: number;
  };
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export const ETable = <
  T extends Record<string, any>,
  COL extends Exclude<keyof T, symbol | number>
>(
  opt: ETableProps<T, COL>
) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // Initialize pagination from props
  const initialPagination = {
    pageIndex: opt.pagination?.initialPageIndex || 0,
    pageSize: opt.pagination?.initialPageSize || 10,
  };
  
  const [pagination, setPagination] = useState(initialPagination);

  // Reset pagination when initialPageIndex changes (for server-side pagination)
  useEffect(() => {
    if (opt.pagination?.mode === "server" && opt.pagination?.initialPageIndex !== undefined) {
      setPagination(prev => ({
        ...prev,
        pageIndex: opt.pagination!.initialPageIndex!,
        pageSize: opt.pagination?.initialPageSize || prev.pageSize,
      }));
    }
  }, [opt.pagination?.initialPageIndex, opt.pagination?.initialPageSize]);


  const div = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const tbody = useRef<HTMLTableSectionElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Enhanced column processing similar to BaseTable
  const visibleColumns = useMemo<ColumnDef<T>[]>(() => {
    let processedColumns: ColumnDef<T>[] = [];

    // Check if columns are already in ColumnDef format (RapidSense style)
    const isColumnDefFormat =
      opt.columns.length > 0 &&
      typeof opt.columns[0] === "object" &&
      ("accessorKey" in opt.columns[0] ||
        "header" in opt.columns[0] ||
        "cell" in opt.columns[0]) &&
      !("name" in opt.columns[0]);

    if (isColumnDefFormat) {
      // Use columns directly if they're already in ColumnDef format
      processedColumns = [...(opt.columns as ColumnDef<T>[])];
    } else {
      // Convert simplified format to ColumnDef format (original logic)
      processedColumns = (opt.columns as SimpleColumnDef<T, COL>[]).map(
        (col) => {
          const colName = typeof col === "string" ? col : col.name;
          return {
            accessorFn: (row) => row[colName],
            id: colName as string,
            header: typeof col === "string" ? col : col.header || col.name,
            cell(props) {
              const cell = props.getValue();
              if (typeof col === "string") {
                return cell;
              }
              if (col.render) {
                return col.render({
                  table: {
                    data: opt.data,
                    columns: visibleColumns,
                    height: 0,
                    rob: null,
                  } as any,
                  row: props.row.original,
                  index: props.row.index,
                  el: {
                    tbody: tbody,
                    container: container,
                  },
                });
              }
              return cell;
            },
          } as ColumnDef<T>;
        }
      );
    }

    // Filter hidden columns
    const filteredColumns = processedColumns.filter((col) => {
      if ("accessorKey" in col && col.accessorKey) {
        return !opt.hideColumns?.includes(col.accessorKey as string);
      }
      return true;
    });

    // Add numbering column if enabled
    if (opt.isShowNumbering) {
      filteredColumns.unshift({
        accessorKey: "no",
        header: "No.",
        size: 40,
        minSize: 40,
        maxSize: 40,
        cell: (context) => {
          // Use meta offset if available for server-side pagination
          if (opt.meta?.offset !== undefined && !isNaN(opt.meta.offset)) {
            const rowNumber = opt.meta.offset + context.row.index + 1;
            return <span className="text-sm font-medium">{rowNumber}</span>;
          }

          // Find the position of this row in the complete dataset
          // This is the most reliable way to get continuous numbering
          const allData = opt.data;
          const currentRowData = context.row.original;

          // Find the index of this row in the complete dataset
          const originalIndex = allData.findIndex((item) => {
            return item === currentRowData || JSON.stringify(item) === JSON.stringify(currentRowData);
          });

          // If we found the original index, use it (1-based)
          if (originalIndex !== -1) {
            return <span className="text-sm font-medium">{originalIndex + 1}</span>;
          }

          // Fallback: use local pagination calculation
          const { pageIndex = 0, pageSize = 10 } = table.getState().pagination || {};
          const rowNumber = pageIndex * pageSize + context.row.index + 1;

          console.log('Fallback numbering used:', {
            pageIndex,
            pageSize,
            rowIndex: context.row.index,
            calculatedNumber: rowNumber
          });

          return <span className="text-sm font-medium">{rowNumber}</span>;
        },
      } as ColumnDef<T>);
    }

    // Add expansion column if enabled
    if (opt.renderExpansion) {
      filteredColumns.push({
        accessorKey: "expansion",
        header: "",
        id: "expansion",
        maxSize: 40,
        cell: ({ row }) => {
          return (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform cursor-pointer text-muted-foreground hover:text-foreground",
                row.getIsExpanded() && "rotate-180"
              )}
            />
          );
        },
      } as ColumnDef<T>);
    }

    return filteredColumns;
  }, [
    opt.columns,
    opt.hideColumns,
    opt.isShowNumbering,
    opt.renderExpansion,
    opt.meta,
    pagination,
  ]);

  // Determine pagination mode - default to client-side pagination
  const isServerPagination = opt.pagination?.mode === "server" || (opt.pagination?.mode !== "client" && !!opt.onPaginationChange);

  const table = useReactTable({
    data: opt.data as any,
    columns: visibleColumns,
    state: {
      pagination: opt.pagination?.enabled ? pagination : undefined,
      rowSelection,
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newState);

      // For server-side pagination, notify parent component
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
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: isServerPagination,
    manualExpanding: true,
    autoResetPageIndex: !isServerPagination, // Allow auto reset for client-side
    getRowId: (row, index) => {
      // @ts-ignore
      return row.id?.toString() || index.toString();
    },
    pageCount: isServerPagination ? (opt.meta?.pageCount || -1) : undefined,
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
        {visibleColumns.length > 0 && (
          <>
            <div className="flex-1 overflow-auto relative">
              {/* Loading overlay for pagination - shows when loading and there's existing data */}
              {opt.isLoading && table.getRowModel().rows?.length > 0 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-600"></div>
                    <span className="text-sm font-medium text-slate-600">Loading...</span>
                  </div>
                </div>
              )}
              <Table
                className="w-full"
                key={`table-${table.getState().pagination?.pageIndex || 0}-${table.getState().pagination?.pageSize || 10}`}
              >
                <TableHeader className="sticky top-0 z-10 bg-slate-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-slate-200"
                    >
                      {headerGroup.headers.map((header) => {
                        const columnSize = header.column.columnDef.size;
                        const columnMinSize = header.column.columnDef.minSize;
                        const columnMaxSize = header.column.columnDef.maxSize;

                        // Default sizes for different column types
                        const getDefaultWidth = () => {
                          const columnId = header.column.id;
                          if (columnId === "no") return "60px";
                          if (columnId === "actions") return "200px";
                          if (columnId === "color") return "100px";
                          if (columnId === "expansion") return "50px";
                          return "auto"; // Default for regular columns
                        };

                        const finalWidth = columnSize
                          ? `${columnSize}px`
                          : getDefaultWidth();

                        return (
                          <TableHead
                            key={header.id}
                            className={cn(
                              "bg-slate-50 text-slate-700 font-semibold border-r border-slate-200 last:border-r-0 h-12 px-4 text-center"
                            )}
                            style={{
                              width: finalWidth,
                              minWidth: columnMinSize
                                ? `${columnMinSize}px`
                                : undefined,
                              maxWidth: columnMaxSize
                                ? `${columnMaxSize}px`
                                : undefined,
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
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
                        <Fragment key={row.id}>
                          <TableRow
                            className={cn(
                              "border-b border-slate-200 hover:bg-slate-50 transition-colors",
                              opt.renderExpansion && "cursor-pointer",
                              row.getIsExpanded() && "bg-slate-50"
                            )}
                            onClick={() => {
                              if (opt.renderExpansion) {
                                row.toggleExpanded();
                              }
                              opt.onRowClick?.(row);
                            }}
                          >
                            {row.getVisibleCells().map((cell) => {
                              const columnJustify =
                                (cell.column.columnDef as any).justify ||
                                "start";

                              // Get text alignment classes
                              const getCellTextAlignClass = (
                                justify: string
                              ) => {
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
                                    cell.column.id === "no" && "text-center", // Force center for numbering
                                    cell.column.id === "color" && "text-center" // Force center for color
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
                          {row.getIsExpanded() && opt.renderExpansion ? (
                            <TableRow className="bg-slate-50/50 border-b border-slate-200">
                              <TableCell
                                className="p-0 border-l-4 border-l-blue-500"
                                colSpan={table.getAllColumns().length}
                              >
                                <div className="p-4">
                                  {opt.renderExpansion(row)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </Fragment>
                      ))}
                    </Fragment>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="h-24 text-center text-slate-500 whitespace-normal"
                        style={{ minWidth: 'auto' }}
                      >
                        {opt.isLoading ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
                            <span className="text-sm font-medium">Loading data...</span>
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
                    // Update the table's page size
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