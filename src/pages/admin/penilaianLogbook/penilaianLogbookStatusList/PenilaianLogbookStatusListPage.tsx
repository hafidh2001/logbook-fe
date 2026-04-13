import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { mockPenilaianLogbookStatusList } from "@/data/penilaianLogbook";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";

type TPenilaianLogbookStatus = (typeof mockPenilaianLogbookStatusList)[number];

export default function PenilaianLogbookStatusListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idLogbookCategory } = useParams<{ idLogbookCategory: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if scored or unscored based on URL path
  const isScored = location.pathname.includes("/scored-logbook");

  // Filter data based on status
  const filteredData = mockPenilaianLogbookStatusList.filter(
    (item) => item.status === (isScored ? "scored" : "unscored")
  );

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handleFilterSearch = (data: Record<string, unknown>) => {
    console.log("Filter search:", data);
  };

  const handleFilterReset = () => {
    console.log("Filter reset");
  };

  const handleRowClick = (row: Row<TPenilaianLogbookStatus>) => {
    console.log("Row clicked:", row.original);
    const detailRoute = isScored
      ? ROUTES.penilaianLogbookScoredLogbookDetail(idLogbookCategory || "", String(row.original.id))
      : ROUTES.penilaianLogbookUnscoredLogbookDetail(idLogbookCategory || "", String(row.original.id));
    navigate(detailRoute);
  };

  const columns: ColumnDef<TPenilaianLogbookStatus>[] = [
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
    },
    {
      accessorKey: "ppds",
      header: "PPDS",
      size: 150,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      size: 100,
      cell: ({ getValue }) => {
        const code = getValue() as string | null;
        return code ? (
          <span className="font-mono text-sm">{code}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "semester",
      header: "Semester",
      size: 120,
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 120,
    },
    {
      accessorKey: "activity",
      header: "Activity",
      size: 150,
    },
    {
      accessorKey: "title",
      header: "Judul",
      size: 150,
      cell: ({ getValue }) => {
        const title = getValue() as string;
        return title ? (
          <span className="truncate block max-w-[140px]" title={title}>
            {title}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 100,
      cell: ({ getValue }) => {
        const total = getValue() as number;
        return <span className="font-medium">{total.toFixed(1)}</span>;
      },
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          const detailRoute = isScored
            ? ROUTES.penilaianLogbookScoredLogbookDetail(idLogbookCategory || "", String(row.original.id))
            : ROUTES.penilaianLogbookUnscoredLogbookDetail(idLogbookCategory || "", String(row.original.id));
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
          { label: "Penilaian Logbook", to: ROUTES.penilaianLogbook },
          { label: "Detail", to: ROUTES.penilaianLogbookDetail(idLogbookCategory || "") },
          { label: isScored ? "Sudah Dinilai" : "Belum Dinilai" },
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
              data={filteredData}
              columns={columns}
              isShowNumbering
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
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