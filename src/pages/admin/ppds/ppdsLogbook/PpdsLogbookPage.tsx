import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { usePpdsStore } from "@/store/ppdsStore";
import { useAuthStore } from "@/store/authStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import type { TPpdsLogbook } from "@/types/ppds";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import usePagination from "@/hooks/usePagination";
import useFilter from "@/hooks/useFilter";
import { FilterValue } from "@/components/filterPanel";

export default function PpdsLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { ppdsLogbookData, isLoading, loadPpdsLogbookList, reset } = usePpdsStore();
  const { user } = useAuthStore();

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
      { key: "id_ppds" },
      { key: "id_staff" },
      { key: "id_activity" },
      { key: "id_stase" },
      { key: "status" },
    ],
    onFilterChange: () => setPage(1),
    initialValues: idUser ? { id_ppds: Number(idUser) } : undefined,
  });

  useEffect(() => {
    // Runs when URL or filter changes
    if (user?.id_client) {
      loadPpdsLogbookList({
        id_client: user.id_client,
        page,
        limit,
        ...filterParams,
        start_date: filterParams.start_date as string | undefined,
        end_date: filterParams.end_date as string | undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterParams]);

  useEffect(() => {
    // IMPORTANT: This reset() MUST be called on unmount to clean up the store state.
    return () => {
      reset();
    };
  }, [reset]);

  // Reset store when sidebar is clicked (URL has no page param)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    // If no page param in URL, reset store
    if (!pageParam) {
      reset();
      // Also force page to 1 in URL if somehow different
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [searchParams, reset, page, setPage]);

  const isInactive = location.pathname.includes("/ppds-inactive/");

  const ppdsListRoute = isInactive ? ROUTES.ppdsInactive : ROUTES.ppds;
  const ppdsDetailRoute = isInactive ? ROUTES.ppdsInactiveDetail(idUser || "") : ROUTES.ppdsDetail(idUser || "");

  const logbooks = ppdsLogbookData?.list || [];

  const handleExport = () => {
    // TODO: Implement export
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPage(pageIndex + 1);
    setLimit(pageSize);
  };

  const handleRowClick = (row: Row<TPpdsLogbook>) => {
    const detailRoute = isInactive
      ? ROUTES.ppdsInactiveLogbookDetail(String(idUser), String(row.original.id))
      : ROUTES.ppdsLogbookDetail(String(idUser), String(row.original.id));
    navigate(detailRoute);
  };

  const getVerifiedBadge = (status: string | null) => {
    if (status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
          <icons.Check className="h-3 w-3" />
          Terverifikasi
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
          <icons.Clock className="h-3 w-3" />
          Menunggu
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
        <icons.X className="h-3 w-3" />
        -
      </span>
    );
  };

  // Define columns for Logbook table
  const columns: ColumnDef<TPpdsLogbook>[] = [
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
      header: "Peserta PPDS",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.ppds_name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 120,
      cell: ({ row: { original } }) => original.nim ?? "-",
    },
    {
      accessorKey: "staff_name",
      header: "Staff Pengajar/DPJP",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.staff_name ? (
          <span>{original.staff_name}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Activity",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.action ?? "-"}</span>
      ),
    },
    {
      accessorKey: "hospital",
      header: "Hospital",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.hospital ? (
          <span className="flex items-center gap-1">
            <icons.MapPin className="h-3 w-3 text-gray-400" />
            {original.hospital}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      size: 200,
      cell: ({ row: { original } }) => {
        return original.notes ? (
          <span className="truncate block max-w-[180px]" title={original.notes}>
            {original.notes}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "verified_status",
      header: "Verified Status",
      size: 140,
      cell: ({ row: { original } }) => getVerifiedBadge(original.verified_status),
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row: { original } }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const detailRoute = isInactive
            ? ROUTES.ppdsInactiveLogbookDetail(String(idUser), String(original.id))
            : ROUTES.ppdsLogbookDetail(String(idUser), String(original.id));
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
          { label: isInactive ? "PPDS Nonaktif" : "PPDS", to: ppdsListRoute },
          { label: "Detail", to: ppdsDetailRoute },
          { label: "Logbook" },
        ]}
        searchPlaceholder="Cari logbook..."
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} initialPpdsId={idUser ? Number(idUser) : undefined} syncValues={filterParams} />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={logbooks}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering={true}
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: ppdsLogbookData?.pagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data logbook"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
