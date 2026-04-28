import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "@/components/basetable/BaseTable";
import { usePenilaianLogbookStore } from "@/store/penilaianLogbookStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import type { TPenilaianLogbook } from "@/types/penilaianLogbook";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import { useEffect } from "react";

export default function PenilaianLogbookListPage() {
  const navigate = useNavigate();

  const { penilaianList, isLoading, loadPenilaianList, reset } = usePenilaianLogbookStore();

  useEffect(() => {
    loadPenilaianList();
    return () => reset();
  }, [loadPenilaianList, reset]);

  const handleRowClick = (row: Row<TPenilaianLogbook>) => {
    navigate(ROUTES.penilaianLogbookDetail(String(row.original.id)));
  };

  // Define columns for Penilaian Logbook table
  const columns: ColumnDef<TPenilaianLogbook>[] = [
    {
      accessorKey: "name",
      header: "Nama Aktivitas",
      size: 300,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "scored",
      header: "Scored",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.scored ?? 0}</span>
      ),
    },
    {
      accessorKey: "unscored",
      header: "Unscored",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.unscored ?? 0}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      size: 120,
      cell: ({ row }) => {
        const handleView = () => {
          navigate(ROUTES.penilaianLogbookDetail(String(row.original.id)));
        };

        return (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <icons.Eye className="h-4 w-4" />
              <span className="ml-1">View</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[68px] lg:pt-0">
      <Topbar breadcrumbs={[{ label: "Penilaian Logbook" }]} />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={penilaianList}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: false, // API returns flat list, no pagination needed
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data penilaian logbook"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
