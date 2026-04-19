import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useLogbookStore } from "@/store/logbookStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect } from "react";

type LogbookEntry = Record<string, any>;

export default function PpdsLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { ppdsLogbook, isLoading, loadPpdsLogbook, reset } = useLogbookStore();

  useEffect(() => {
    if (idUser) {
      loadPpdsLogbook(idUser);
    }
    return () => reset();
  }, [idUser, loadPpdsLogbook, reset]);

  const isInactive = location.pathname.includes("/ppds-inactive/");

  const ppdsListRoute = isInactive ? ROUTES.ppdsInactive : ROUTES.ppds;
  const ppdsDetailRoute = isInactive ? ROUTES.ppdsInactiveDetail(idUser || "") : ROUTES.ppdsDetail(idUser || "");

  const logbooks = ppdsLogbook?.logbooks || [];

  const handleExport = () => {
    // TODO: Implement export
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  const handleFilterSearch = (data: Record<string, unknown>) => {
    console.log("Filter search:", data);
  };

  const handleFilterReset = () => {
    console.log("Filter reset");
  };

  const handleRowClick = (row: Row<LogbookEntry>) => {
    console.log("Row clicked:", row.original);
    const detailRoute = isInactive
      ? ROUTES.ppdsInactiveLogbookDetail(String(idUser), String(row.original.no))
      : ROUTES.ppdsLogbookDetail(String(idUser), String(row.original.no));
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
  const columns: ColumnDef<LogbookEntry>[] = [
    {
      accessorKey: "no",
      header: "No.",
      size: 60,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.no}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.date ? (
          <span className="whitespace-nowrap">
            {dayjs(original.date).locale("id").format("DD MMM YYYY – HH:mm")}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "activity",
      header: "Activity",
      size: 200,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.activity ?? "-"}</span>
      ),
    },
    {
      accessorKey: "staffPengajar",
      header: "Staff Pengajar",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.staffPengajar ? (
          <span>{original.staffPengajar}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "hospital",
      header: "Hospital",
      size: 180,
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
      accessorKey: "verifiedStatus",
      header: "Status",
      size: 140,
      cell: ({ row: { original } }) => getVerifiedBadge(original.verifiedStatus),
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row: { original } }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const detailRoute = isInactive
            ? ROUTES.ppdsInactiveLogbookDetail(String(idUser), String(original.no))
            : ROUTES.ppdsLogbookDetail(String(idUser), String(original.no));
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
          <Filter onSearch={handleFilterSearch} onReset={handleFilterReset} />

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={logbooks}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering={false}
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
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
