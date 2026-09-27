import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "@/components/basetable/BaseTable";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import "dayjs/locale/id";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useMorbidityStore } from "@/store/morbidityStore";
import { TMorbidity } from "@/types/morbidity";

export default function MorbidityListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  const { morbidityData, isLoading, loadMorbidityList, reset } =
    useMorbidityStore();

  // ========== URL PARAMS (using useUrlParams hook) ==========
  const { page, limit, search, debouncedSearch, setLimit, setSearch } =
    useUrlParams({
      defaultPage: 1,
      defaultLimit: DEFAULT_PAGE_SIZE,
      filterKeys: [],
      searchDebounceMs: 500,
    });

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  const handlePaginationChange = (_pageIndex: number, pageSize: number) => {
    setLimit(pageSize, false);
  };

  // ========== DATA FETCHING ==========

  useEffect(() => {
    loadMorbidityList({
      page,
      limit,
      search: debouncedSearch || undefined,
    });
  }, [page, limit, debouncedSearch, loadMorbidityList]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleRowClick = (row: Row<TMorbidity>) => {
    if (row.original.id) {
      navigate(ROUTES.morbidityByUser(String(row.original.id_user)));
    }
  };

  // Define columns for Morbidity table
  const columns: ColumnDef<TMorbidity>[] = [
    {
      accessorKey: "display_name",
      header: "Name",
      size: 200,
      cell: ({ row: { original } }) => original.display_name ?? "-",
    },
    {
      accessorKey: "code",
      header: "Code",
      size: 120,
      cell: ({ row: { original } }) => original.code ?? "-",
    },
    {
      accessorKey: "poin_aktif",
      header: "Active Point",
      size: 120,
      cell: ({ row: { original } }) => original.poin_aktif ?? "0",
    },
    {
      accessorKey: "jml_logbook",
      header: "Logbook Count",
      size: 120,
      cell: ({ row: { original } }) => original.jml_logbook ?? "0",
    },
    {
      accessorKey: "verified",
      header: "Verified",
      size: 120,
      cell: ({ row: { original } }) => original.verified ?? "0",
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 180 : 120,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (row.original.id) {
            navigate(ROUTES.morbidityByUser(String(row.original.id_user)));
          }
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
        breadcrumbs={[{ label: "Morbidity", to: ROUTES.morbidity }]}
        searchPlaceholder="Cari morbiditas..."
        onSearch={handleSearchChange}
        initialSearchValue={search}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={morbidityData.list}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: morbidityData.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data morbiditas"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
