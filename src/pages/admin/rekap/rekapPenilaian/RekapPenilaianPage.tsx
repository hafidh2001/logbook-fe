import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useRekapStore } from "@/store/rekapStore";
import { useAuthStore } from "@/store/authStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect, useState } from "react";
import usePagination from "@/hooks/usePagination";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import useFilter from "@/hooks/useFilter";
import { FilterValue } from "@/components/filterPanel";
import { useDebounce } from "@/hooks/useDebounce";
import dayjs from "dayjs";
import "dayjs/locale/id";

export default function RekapPenilaianPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const {
    rekapPenilaian,
    rekapPenilaianPagination,
    isLoading,
    loadRekapPenilaian,
    reset,
  } = useRekapStore();

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit, searchParams } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<
    Omit<Record<string, FilterValue>, "start_date" | "end_date"> & {
      start_date?: string;
      end_date?: string;
    }
  >({
    fields: [
      { key: "ppds_name" },
      { key: "staff_name" },
      { key: "activity_name" },
      { key: "stase_name" },
      { key: "start_date" },
      { key: "end_date" },
    ],
    onFilterChange: () => setPage(1),
  });

  // Search state with 500ms debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, setPage]);

  useEffect(() => {
    if (user?.id_client) {
      loadRekapPenilaian({
        id_client: user.id_client,
        page,
        limit,
        search: debouncedSearchQuery || undefined,
        ppds_name: (filterParams.ppds_name as string | null) ?? undefined,
        staff_name: (filterParams.staff_name as string | null) ?? undefined,
        activity_name: (filterParams.activity_name as string | null) ?? undefined,
        stase_name: (filterParams.stase_name as string | null) ?? undefined,
        start_date: filterParams.start_date ?? undefined,
        end_date: filterParams.end_date ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filterParams, debouncedSearchQuery]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Reset store when sidebar is clicked (URL has no page param)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (!pageParam) {
      reset();
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [searchParams, reset, page, setPage]);

  const handleExport = () => {
    // TODO: Implement export
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<typeof rekapPenilaian[number]>) => {
    navigate(ROUTES.rekapPenilaianDetail(String(row.original.id_logbook)));
  };

  const handleView = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(ROUTES.rekapPenilaianDetail(String(id)));
  };

  // Define columns for Rekap Penilaian table
  const columns: ColumnDef<typeof rekapPenilaian[number]>[] = [
    {
      accessorKey: "date_logbook",
      header: "Date",
      size: 150,
      cell: ({ row: { original } }) => original.date_logbook ? (
        <span className="whitespace-nowrap">
          {dayjs(original.date_logbook).locale("id").format("DD MMM YYYY")}
        </span>
      ) : "-",
    },
    {
      accessorKey: "ppds",
      header: "PPDS",
      size: 120,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.ppds ?? "-"}</span>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 100,
      cell: ({ row: { original } }) => original.nim ?? "-",
    },
    {
      accessorKey: "inisial_code",
      header: "Initial Code",
      size: 100,
      cell: ({ row: { original } }) => original.inisial_code ?? "-",
    },
    {
      accessorKey: "semester",
      header: "Semester",
      size: 120,
      cell: ({ row: { original } }) => original.semester ?? "-",
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 130,
      cell: ({ row: { original } }) => {
        return original.stase ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
            {original.stase}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "pin",
      header: "PIN",
      size: 100,
      cell: ({ row: { original } }) => original.pin ?? "-",
    },
    {
      accessorKey: "staff",
      header: "Staff Pengajar / DPJP",
      size: 140,
      cell: ({ row: { original } }) => original.staff ?? "-",
    },
    {
      accessorKey: "action",
      header: "Action",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.action ? (
          <span className="font-medium">{original.action}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "peran",
      header: "Peran",
      size: 120,
      cell: ({ row: { original } }) => original.peran ?? "-",
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 150,
      cell: ({ row: { original } }) => original.category ?? "-",
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 180,
      cell: ({ row: { original } }) => original.title ?? "-",
    },
    {
      accessorKey: "psikomotor",
      header: "Psikomotor",
      size: 100,
      cell: ({ row: { original } }) => original.psikomotor ?? "-",
    },
    {
      accessorKey: "knowledge",
      header: "Knowledge",
      size: 100,
      cell: ({ row: { original } }) => original.knowledge ?? "-",
    },
    {
      accessorKey: "afektif",
      header: "Afektif",
      size: 100,
      cell: ({ row: { original } }) => original.afektif ?? "-",
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 100,
      cell: ({ row: { original } }) => original.total ?? "-",
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row: { original } }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleView(e, original.id_logbook)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <icons.Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[{ label: "Rekap" }, { label: "Penilaian" }]}
        searchPlaceholder="Cari penilaian..."
        onExport={handleExport}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={rekapPenilaian}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: rekapPenilaianPagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data penilaian"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
