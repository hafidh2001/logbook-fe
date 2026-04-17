import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { mockStaffList } from "@/data/staff";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type TStaff = (typeof mockStaffList)[number];

export default function StaffListPage() {
  const { width } = useWindowDimensions();
  const sm = width >= 480;

  const navigate = useNavigate();

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: TStaff | null;
  }>({ open: false, item: null });

  const handleCreate = () => {
    navigate(ROUTES.staffCreate);
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

  const handleDelete = (item: TStaff) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      console.log("Deleting item:", deleteModal.item);
      // TODO: Call API to delete
    }
    setDeleteModal({ open: false, item: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, item: null });
  };

  // Define columns for Staff table
  const columns: ColumnDef<TStaff>[] = [
    {
      accessorKey: "display_name",
      header: "Nama",
      size: 180,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.display_name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      size: 180,
      cell: ({ row: { original } }) => original.username ?? "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 180,
      cell: ({ row: { original } }) => {
        return original.email ? (
          <span>{original.email}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.phone ? (
          <span>{original.phone}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Code",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.code ? (
          <span className="font-mono text-sm">{original.code}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "logbook_status",
      header: "Logbook",
      size: 100,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.logbook_status ?? "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      size: sm ? 350 : 180,
      cell: ({ row: { original } }) => {
        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.staffDetail(String(original.id)));
        };
        const handleChangePassword = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigate(ROUTES.staffChangePassword(String(original.id)));
        };
        const handleDeleteClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          handleDelete(original);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChangePassword}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              <icons.Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Password</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <icons.Trash className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[{ label: "Staff", to: ROUTES.staff }]}
        searchPlaceholder="Cari staff..."
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
              data={mockStaffList}
              columns={columns}
              isShowNumbering
              pagination={{
                enabled: true,
                initialPageIndex: 0,
                initialPageSize: 10,
              }}
              noDataText="Tidak ada data staff"
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({ open, item: deleteModal.item })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data{" "}
              <span className="font-semibold">
                {deleteModal.item?.display_name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
