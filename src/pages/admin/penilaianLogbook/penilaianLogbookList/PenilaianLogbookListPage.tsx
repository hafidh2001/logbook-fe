import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "@/components/basetable/BaseTable";
import { mockPenlaianLogbookList } from "@/data/penilaianLogbook";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";

type TPenilaianLogbook = (typeof mockPenlaianLogbookList)[number];

export default function PenilaianLogbookListPage() {
  const navigate = useNavigate();
  // Define columns for Penilaian Logbook table
  const columns: ColumnDef<TPenilaianLogbook>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      size: 300,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "totalScored",
      header: "Scored",
      size: 150,
      cell: ({ getValue }) => (
        <span className="text-center block">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "totalUnscored",
      header: "Unscored",
      size: 150,
      cell: ({ getValue }) => (
        <span className="text-center block">{getValue() as number}</span>
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
    <div className="h-screen bg-gray-50 flex flex-col">
      <Topbar
        breadcrumbs={[{ label: "Penilaian Logbook" }]}
      />
      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={mockPenlaianLogbookList}
              columns={columns}
              isShowNumbering
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
              noDataText="Tidak ada data penilaian logbook"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}