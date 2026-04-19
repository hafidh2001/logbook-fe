import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useRekapStore } from "@/store/rekapStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect } from "react";

type TRekapPenilaian = Record<string, any>;

export default function RekapPenilaianPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;
  const navigate = useNavigate();

  const { rekapPenilaian, isLoading, loadRekapPenilaian, reset } = useRekapStore();

  useEffect(() => {
    loadRekapPenilaian();
    return () => reset();
  }, [loadRekapPenilaian, reset]);

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

  const handleRowClick = (row: Row<TRekapPenilaian>) => {
    navigate(ROUTES.rekapPenilaianDetail(String(row.original.id)));
  };

  const handleView = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(ROUTES.rekapPenilaianDetail(String(id)));
  };

  // Define columns for Rekap Penilaian table
  const columns: ColumnDef<TRekapPenilaian>[] = [
    {
      accessorKey: "date_logbook",
      header: "Date",
      size: 150,
      cell: ({ row: { original } }) => original.date_logbook ?? "-",
    },
    {
      accessorKey: "ppds",
      header: "PPDS",
      size: 120,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.ppds ?? "-"}</span>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 100,
      cell: ({ row: { original } }) => original.nim ?? "-",
    },
    {
      accessorKey: "inisial_code",
      header: "Initial Code",
      size: 100,
      cell: ({ row: { original } }) => original.inisial_code ?? "-",
    },
    {
      accessorKey: "semester",
      header: "Semester",
      size: 120,
      cell: ({ row: { original } }) => original.semester ?? "-",
    },
    {
      accessorKey: "stage",
      header: "Stage",
      size: 130,
      cell: ({ row: { original } }) => {
        return original.stage ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
            {original.stage}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "pin",
      header: "PIN",
      size: 100,
      cell: ({ row: { original } }) => original.pin ?? "-",
    },
    {
      accessorKey: "staff",
      header: "Staff Pengajar / DPJP",
      size: 140,
      cell: ({ row: { original } }) => original.staff ?? "-",
    },
    {
      accessorKey: "action",
      header: "Action",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.action ? (
          <span className="font-medium">{original.action}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "peran",
      header: "Peran",
      size: 120,
      cell: ({ row: { original } }) => {
        return original.peran ?? "-";
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.category ?? "-";
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.title ?? "-";
      },
    },
    {
      accessorKey: "psikomotor",
      header: "Psikomotor",
      size: 100,
      cell: ({ row: { original } }) => {
        return original.psikomotor ?? "-";
      },
    },
    {
      accessorKey: "knowledge",
      header: "Knowledge",
      size: 100,
      cell: ({ row: { original } }) => {
        return original.knowledge ?? "-";
      },
    },
    {
      accessorKey: "afektif",
      header: "Afektif",
      size: 100,
      cell: ({ row: { original } }) => {
        return original.afektif ?? "-";
        <span className="text-gray-400">-</span>;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 100,
      cell: ({ row: { original } }) => {
        return original.total ?? "-";
      },
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 120 : 80,
      cell: ({ row: { original } }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleView(e, original.id)}
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
        breadcrumbs={[{ label: "Rekap" }, { label: "Penilaian" }]}
        searchPlaceholder="Cari penilaian..."
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
              data={rekapPenilaian}
              columns={columns}
              isLoading={isLoading}
              isShowNumbering
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data penilaian"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
