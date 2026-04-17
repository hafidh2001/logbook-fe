import { Topbar } from "@/components/ui/Topbar";
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

type TPenilaianLogbookStatus = Record<string, any>;

export default function PenilaianLogbookStatusListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const { idLogbookCategory } = useParams<{ idLogbookCategory: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { statusList, isLoading, loadStatusList, reset } = usePenilaianLogbookStore();

  useEffect(() => {
    loadStatusList();
    return () => reset();
  }, [loadStatusList, reset]);

  // Determine if scored or unscored based on URL path
  const isScored = location.pathname.includes("/scored-logbook");

  // Filter data based on status
  const filteredData = statusList.filter(
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
      cell: ({ row: { original } }) => original.date ?? "-",
    },
    {
      accessorKey: "ppds",
      header: "PPDS",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.ppds ?? "-"}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      size: 100,
      cell: ({ row: { original } }) => {
        return original.code ? (
          <span className="font-mono text-sm">{original.code}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
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
      size: 120,
      cell: ({ row: { original } }) => original.stase ?? "-",
    },
    {
      accessorKey: "activity",
      header: "Activity",
      size: 150,
      cell: ({ row: { original } }) => original.activity ?? "-",
    },
    {
      accessorKey: "title",
      header: "Judul",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.title ? (
          <span className="truncate block max-w-[140px]" title={original.title}>
            {original.title}
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
      cell: ({ row: { original } }) => {
        return <span className="font-medium">{original.total.toFixed(1)}</span>;
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
    <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Penilaian Logbook", to: ROUTES.penilaianLogbook },
          { label: "Status", to: ROUTES.penilaianLogbookDetail(idLogbookCategory || "") },
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
              data={filteredData}
              columns={columns}
              isLoading={isLoading}
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