import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { mockPpdsList } from "@/data/ppds";
import { TPpds } from "@/types/ppds";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";

export default function PpdsListPage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(ROUTES.ppdsCreate);
  };

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

  const handleRowClick = (row: Row<TPpds>) => {
    console.log("Row clicked:", row.original);
    // TODO: Navigate to detail page with actual id
    navigate(ROUTES.ppds);
  };

  // Define columns for PPDS table
  const columns: ColumnDef<TPpds>[] = [
    {
      accessorKey: "displayName",
      header: "Nama",
      size: 150,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      size: 120,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 180,
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 100,
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "stage",
      header: "Stage",
      size: 120,
      cell: ({ getValue }) => {
        const stage = getValue() as string | null;
        return stage ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
            {stage}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        );
      },
    },
    {
      accessorKey: "logbook",
      header: "Logbook",
      size: 80,
      cell: ({ getValue }) => (
        <span className="text-center block">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Tanggal Lahir",
      size: 120,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return dayjs(date).locale("id").format("DD MMMM YYYY");
      },
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Topbar
        breadcrumbs={[{ label: "PPDS", to: ROUTES.ppds }]}
        searchPlaceholder="Cari PPDS..."
        onCreate={handleCreate}
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
              data={mockPpdsList}
              columns={columns}
              isShowNumbering
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data PPDS"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
