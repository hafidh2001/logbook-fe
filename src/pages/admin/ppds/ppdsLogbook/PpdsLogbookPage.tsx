import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { mockPpdsLogbook } from "@/data/ppds";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";

interface LogbookEntry {
  no: number;
  date: string;
  staffPengajar: string | null;
  activity: string;
  hospital: string | null;
  notes: string;
  verifiedStatus: "pending" | "verified";
}

export default function PpdsLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isInactive = location.pathname.includes("/ppds-inactive/");

  const ppdsListRoute = isInactive ? ROUTES.ppdsInactive : ROUTES.ppds;
  const ppdsDetailRoute = isInactive ? ROUTES.ppdsInactiveDetail(idUser || "") : ROUTES.ppdsDetail(idUser || "");
  const ppdsLogbookRoute = isInactive ? ROUTES.ppdsInactiveLogbook(idUser || "") : ROUTES.ppdsLogbook(idUser || "");

  const logbooks = mockPpdsLogbook.logbooks as LogbookEntry[];

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
      cell: ({ getValue }) => (
        <span className="text-center block">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 180,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return (
          <span className="whitespace-nowrap">
            {dayjs(date).locale("id").format("DD MMM YYYY – HH:mm")}
          </span>
        );
      },
    },
    {
      accessorKey: "activity",
      header: "Activity",
      size: 200,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "staffPengajar",
      header: "Staff Pengajar",
      size: 150,
      cell: ({ getValue }) => {
        const staff = getValue() as string | null;
        return staff ? (
          <span>{staff}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "hospital",
      header: "Hospital",
      size: 180,
      cell: ({ getValue }) => {
        const hospital = getValue() as string | null;
        return hospital ? (
          <span className="flex items-center gap-1">
            <icons.MapPin className="h-3 w-3 text-gray-400" />
            {hospital}
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
      cell: ({ getValue }) => {
        const notes = getValue() as string;
        return notes ? (
          <span className="truncate block max-w-[180px]" title={notes}>
            {notes}
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
      cell: ({ getValue }) => getVerifiedBadge(getValue() as string | null),
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const detailRoute = isInactive
            ? ROUTES.ppdsInactiveLogbookDetail(String(idUser), String(row.original.no))
            : ROUTES.ppdsLogbookDetail(String(idUser), String(row.original.no));
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
    <div className="h-screen bg-gray-50 flex flex-col">
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
