import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { mockRekapLogbook } from "@/data/rekap";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";

type TRekapLogbook = (typeof mockRekapLogbook)[number];

export default function RekapLogbookPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;
  const navigate = useNavigate();

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

  const handleRowClick = (row: Row<TRekapLogbook>) => {
    navigate(ROUTES.rekapLogbookDetail(String(row.original.id)));
  };

  const handleView = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(ROUTES.rekapLogbookDetail(String(id)));
  };

  const getStatusBadge = (status: string | null) => {
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
        -
      </span>
    );
  };

  // Define columns for Rekap Logbook table
  const columns: ColumnDef<TRekapLogbook>[] = [
    {
      accessorKey: "date",
      header: "Date",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.date ?? "-";
      },
    },
    {
      accessorKey: "ppds",
      header: "PPDS",
      size: 120,
      cell: ({ row: { original } }) => {
        return <span className="font-medium">{original.ppds ?? "-"}</span>;
      },
    },
    {
      accessorKey: "nim",
      header: "NIM",
      size: 100,
      cell: ({ row: { original } }) => {
        return original.nim ?? "-";
      },
    },
    {
      accessorKey: "semester",
      header: "Semester",
      size: 120,
      cell: ({ row: { original } }) => {
        return original.semester ?? "-";
      },
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 130,
      cell: ({ row: { original } }) => {
        return original.stase ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap">
            {original.stase}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "pin",
      header: "PIN",
      size: 80,
      cell: ({ row: { original } }) => {
        return original.pin ?? "-";
      },
    },
    {
      accessorKey: "staff_pengajar",
      header: "Staff Pengajar",
      size: 130,
      cell: ({ row: { original } }) => {
        return original.staff_pengajar ?? "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.status ? getStatusBadge(original.status) : "-";
      },
    },
    {
      accessorKey: "activity",
      header: "Activity",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.activity ?? "-";
      },
    },
    {
      accessorKey: "peran",
      header: "Peran",
      size: 130,
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
      size: 200,
      cell: ({ row: { original } }) => {
        return original.title ?? "-";
      },
    },
    {
      accessorKey: "attachment",
      header: "Attachment",
      size: 120,
      cell: ({ row: { original } }) => {
        return original.attachment ?? "-";
      },
    },
    {
      accessorKey: "patient",
      header: "Patient",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.patient ?? "-";
      },
    },
    {
      accessorKey: "diagnosis",
      header: "Diagnosis",
      size: 200,
      cell: ({ row: { original } }) => {
        return original.diagnosis ?? "-";
      },
    },
    {
      accessorKey: "treatment",
      header: "Treatment",
      size: 200,
      cell: ({ row: { original } }) => {
        return original.treatment ?? "-";
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
        breadcrumbs={[{ label: "Rekap" }, { label: "Logbook" }]}
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
              data={mockRekapLogbook}
              columns={columns}
              isShowNumbering
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
