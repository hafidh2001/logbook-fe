import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { usePenilaianLogbookStore } from "@/store/penilaianLogbookStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect } from "react";
import { PenilaianLogbookStatusEnum } from "@/types";
import type { TPenilaianLogbookStatusListItem } from "@/types/penilaianLogbook";
import usePagination from "@/hooks/usePagination";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import useFilter from "@/hooks/useFilter";
import dayjs from "dayjs";

export default function PenilaianLogbookStatusListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idLogbookCategory } = useParams<{ idLogbookCategory: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    penilaianLogbookStatusList,
    penilaianLogbookStatusPagination,
    isLoading,
    loadPenilaianLogbookByStatus,
    reset,
  } = usePenilaianLogbookStore();

  // Pagination - page is always read from URL
  const { page, setPage, limit, setLimit, searchParams } = usePagination({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  // Filter hook
  const { filterParams, handleFilterSearch, handleFilterReset } = useFilter<{
    id_ppds?: number | null;
    id_staff?: number | null;
    id_stase?: number | null;
    start_date?: string;
    end_date?: string;
  }>({
    fields: [
      { key: "id_ppds" },
      { key: "id_staff" },
      { key: "id_stase" },
      { key: "start_date" },
      { key: "end_date" },
    ],
    onFilterChange: () => setPage(1),
  });

  // Determine if scored or unscored based on URL path
  const isScored = location.pathname.includes("/scored-logbook");

  useEffect(() => {
    loadPenilaianLogbookByStatus({
      id_action: Number(idLogbookCategory),
      type: isScored
        ? PenilaianLogbookStatusEnum.SCORED
        : PenilaianLogbookStatusEnum.UNSCORED,
      page,
      limit,
      id_ppds: filterParams.id_ppds ?? undefined,
      id_staff: filterParams.id_staff ?? undefined,
      id_stase: filterParams.id_stase ?? undefined,
      start_date: filterParams.start_date ?? undefined,
      end_date: filterParams.end_date ?? undefined,
    });
  }, [
    searchParams,
    filterParams,
    idLogbookCategory,
    isScored,
    loadPenilaianLogbookByStatus,
  ]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<TPenilaianLogbookStatusListItem>) => {
    const detailRoute = isScored
      ? ROUTES.penilaianLogbookScoredLogbookDetail(
          idLogbookCategory || "",
          String(row.original.id),
        )
      : ROUTES.penilaianLogbookUnscoredLogbookDetail(
          idLogbookCategory || "",
          String(row.original.id),
        );
    navigate(detailRoute);
  };

  const columns: ColumnDef<TPenilaianLogbookStatusListItem>[] = [
    {
      accessorKey: "date",
      header: "Date",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.date ? (
          <span className="whitespace-nowrap">
            {dayjs(original.date).locale("id").format("DD MMM YYYY")}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "ppds_name",
      header: "PPDS",
      size: 180,
      cell: ({ row: { original } }) => original.ppds_name ?? "-",
    },
    {
      accessorKey: "code",
      header: "Code",
      size: 100,
      cell: ({ row: { original } }) => original.code ?? "-",
    },
    {
      accessorKey: "inisial_code",
      header: "Inisial Code",
      size: 100,
      cell: ({ row: { original } }) => original.inisial_code ?? "-",
    },
    {
      accessorKey: "semester_name",
      header: "Semester",
      size: 120,
      cell: ({ row: { original } }) => original.semester_name ?? "-",
    },
    {
      accessorKey: "stase_name",
      header: "Stase",
      size: 120,
      cell: ({ row: { original } }) => original.stase_name ?? "-",
    },
    {
      accessorKey: "stage_name",
      header: "Pin",
      size: 120,
      cell: ({ row: { original } }) => original.stage_name ?? "-",
    },
    {
      accessorKey: "staff_names",
      header: "Staff Pengajar/DPJP",
      size: 150,
      cell: ({ row: { original } }) => original.staff_name ?? "-",
    },
    {
      accessorKey: "action_name",
      header: "Activity",
      size: 150,
      cell: ({ row: { original } }) => original.action_name ?? "-",
    },
    {
      accessorKey: "role_name",
      header: "Peran",
      size: 150,
      cell: ({ row: { original } }) => original.role_name ?? "-",
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
      size: 150,
      cell: ({ row: { original } }) => original.title ?? "-",
    },
    {
      accessorKey: "psikomotor",
      header: "Psikomotor",
      size: 100,
      cell: ({ row: { original } }) => original.psikomotor ?? 0,
    },
    {
      accessorKey: "knowledge",
      header: "Knowledge",
      size: 100,
      cell: ({ row: { original } }) => original.knowledge ?? 0,
    },
    {
      accessorKey: "afektif",
      header: "Afektif",
      size: 100,
      cell: ({ row: { original } }) => original.afektif ?? 0,
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 100,
      cell: ({ row: { original } }) => original.total ?? 0,
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const detailRoute = isScored
            ? ROUTES.penilaianLogbookScoredLogbookDetail(
                idLogbookCategory || "",
                String(row.original.id),
              )
            : ROUTES.penilaianLogbookUnscoredLogbookDetail(
                idLogbookCategory || "",
                String(row.original.id),
              );
          navigate(detailRoute);
        };

        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
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
        breadcrumbs={[
          { label: "Penilaian Logbook", to: ROUTES.penilaianLogbook },
          {
            label: "Status",
            to: ROUTES.penilaianLogbookDetail(idLogbookCategory || ""),
          },
          { label: isScored ? "Scored" : "Unscored" },
        ]}
        searchPlaceholder="Cari logbook..."
        onSearch={handleSearch}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={penilaianLogbookStatusList}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: penilaianLogbookStatusPagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText={`Tidak ada data logbook ${isScored ? "sudah" : "belum"} dinilai`}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
