import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useSearchParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import {
  BaseTable,
  type ExtendedColumnDef,
} from "@/components/basetable/BaseTable";
import { useEffect, useRef, useState } from "react";
import { useRekapStore } from "@/store/rekapStore";
import { LoadingPage } from "@/components/layout/Loading";
import { Summary } from "./_components/Summary";
import { ActivityBreakdown } from "./_components/ActivityBreakdown";
import { StatusBadge } from "@/components/statusBadge";
import { useAuthStore } from "@/store/authStore";
import useUrlParams from "@/hooks/useUrlParams";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { TRekapReportLogbookDetail } from "@/types/rekap";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { ExportFormat } from "@/components/exportButton";
import { ExportModal } from "@/components/exportModal/ExportModal";
import { showToast } from "@/utils/toast";
import { ExportColumn, exportToCSV, exportToExcel } from "@/functions/export";

export default function RekapReportDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();

  const { user } = useAuthStore();
  const {
    filterRekapReport,
    rekapReportDetail: data,
    rekapReportDetailPagination,
    rekapReportDetailSummary: dataSummary,
    rekapReportDetailActivity: dataActivity,
    isLoadingReportDetail,
    loadRekapReportDetail,
    loadExportRekapReportDetail,
    cancelExportReportDetail,
    isExportingReportDetail,
    resetReportDetail,
    setFilterRekapReport,
  } = useRekapStore();

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const start_date = searchParams.get("start_date") ?? "";
  const end_date = searchParams.get("end_date") ?? "";

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!params.has("start_date")) {
      params.set("start_date", filterRekapReport.start_date);
      changed = true;
    } else {
      setFilterRekapReport({
        ...filterRekapReport,
        start_date: start_date ?? "",
      });
    }

    if (!params.has("end_date")) {
      params.set("end_date", filterRekapReport.end_date);
      changed = true;
    } else {
      setFilterRekapReport({
        ...filterRekapReport,
        end_date: end_date ?? "",
      });
    }

    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, [start_date, end_date]);

  // ========== URL PARAMS (using useUrlParams hook) ==========
  // Note: Rekap uses string-based filters (name as value), not numeric IDs
  const { page, limit, setLimit } = useUrlParams({
    defaultPage: 1,
    defaultLimit: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    if (idUser && user?.id_client) {
      loadRekapReportDetail({
        id: Number(idUser),
        id_client: user.id_client,
        page,
        limit,
        start_date: start_date,
        end_date: end_date,
      });
    }
  }, [page, limit, idUser, loadRekapReportDetail, start_date, end_date]);

  useEffect(() => {
    return () => resetReportDetail();
  }, [resetReportDetail]);

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      const allData = await loadExportRekapReportDetail({
        filterParams: {
          id: Number(idUser),
          id_client: user?.id_client ?? 0,
          start_date,
          end_date,
        },
        onProgress: (progress, offset) => {
          setExportProgress(progress);
          setExportOffset(offset);
        },
        signal: exportControllerRef.current.signal,
      });

      if (allData.length === 0) {
        showToast("Tidak ada data untuk diekspor", "error");
        setShowExportModal(false);
        return;
      }

      // Define columns for export
      const exportColumns: ExportColumn<TRekapReportLogbookDetail>[] = [
        { header: "No", accessorKey: "no" },
        {
          header: "Tanggal",
          accessorKey: "tanggal",
          formatter: (value) =>
            value ? dayjs(value).locale("id").format("DD MMMM YYYY") : "-",
        },
        { header: "Aktivitas", accessorKey: "aktivitas" },
        { header: "Judul", accessorKey: "judul" },
        { header: "Stase", accessorKey: "stase" },
        { header: "Status", accessorKey: "status" },
      ];

      const summaryRows = [
        {
          label: "User",
          value: dataSummary?.ppds ?? "-",
        },
        {
          label: "Total Logbooks",
          value: dataSummary?.total_logbooks ?? "-",
        },
        {
          label: "Semester",
          value: dataSummary?.semester ?? "-",
        },
        {
          label: "Date Range",
          value: `${dayjs(start_date).locale("id").format("DD MMM YYYY - HH:mm")} - ${dayjs(end_date).locale("id").format("DD MMM YYYY - HH:mm")}`,
        },
      ];

      // Prepare data with index number
      const dataWithIndex = allData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      const filename = `rekap_report_detail_${dataSummary?.ppds}_${dayjs().format("YYYY-MM-DD")}`;

      if (format === "csv") {
        exportToCSV({
          data: dataWithIndex,
          columns: exportColumns,
          filename: `${filename}.csv`,
          summaryRows,
        });
      } else if (format === "excel") {
        await exportToExcel({
          data: dataWithIndex,
          columns: exportColumns,
          filename: `${filename}.xlsx`,
          sheetName: "Rekap Report Export",
          summaryRows,
        });
      }

      showToast(`Berhasil mengekspor ${allData.length} data`, "success");

      // Set complete state - modal stays open until user clicks OK
      setIsExportComplete(true);
    } catch (error) {
      // Check if cancelled
      if (error instanceof Error && error.message === "EXPORT_CANCELLED") {
        showToast("Export dibatalkan", "error");
        setShowExportModal(false);
        return;
      }
      console.error("Export error:", error);
      showToast(
        error instanceof Error ? error.message : "Gagal mengekspor data",
        "error",
      );
      setShowExportModal(false);
    } finally {
      exportControllerRef.current = null;
    }
  };

  const handleCancelExport = () => {
    if (exportControllerRef.current) {
      exportControllerRef.current.abort();
      cancelExportReportDetail();
    }
    setShowExportModal(false);
    setIsExportComplete(false);
    exportControllerRef.current = null;
  };

  const handleOkExport = () => {
    setShowExportModal(false);
    setIsExportComplete(false);
  };

  const [isReload, setIsReload] = useState(true);

  const handlePaginationChange = (_pageIndex: number, pageSize: number) => {
    setLimit(pageSize, false);
    setIsReload(false);
  };

  const columns: ExtendedColumnDef<TRekapReportLogbookDetail>[] = [
    {
      accessorKey: "tanggal",
      header: "Date",
      size: 120,
      cell: ({ row: { original } }) =>
        original.tanggal
          ? dayjs(original.tanggal).locale("id").format("DD MMMM YYYY")
          : "-",
    },
    {
      accessorKey: "aktivitas",
      header: "Activity",
      size: 200,
      cell: ({ row: { original } }) => original.aktivitas ?? "-",
    },
    {
      accessorKey: "judul",
      header: "Title",
      size: 200,
      cell: ({ row: { original } }) => original.judul ?? "-",
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 150,
      cell: ({ row: { original } }) => {
        return original.stase ? (
          <span
            className={cn(
              "px-2 py-1 bg-[#EAF6EF] text-[#066649] rounded-md text-xs font-medium whitespace-nowrap",
              // original.is_retake && "bg-[#FFE5DE] text-[#B84732]",
            )}
          >
            {original.stase}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row: { original } }) => (
        <StatusBadge status={original.status ?? null} />
      ),
    },
  ];

  if (isLoadingReportDetail && isReload) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <ExportModal
        isShown={showExportModal}
        progress={exportProgress}
        offset={exportOffset}
        total={rekapReportDetailPagination.total}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Report", to: ROUTES.rekapReport },
          { label: "Detail" },
        ]}
        onExport={handleExport}
        isLoading={isExportingReportDetail}
      />
      <div className="flex-1 px-4 sm:px-6 py-4 overflow-auto min-h-0">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          {/* Header Title */}
          <div className="flex-shrink-0 max-w-5xl">
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Rekap Report - {dataSummary?.ppds ?? "-"}
            </h1>
          </div>

          {/* Card 1 - Summary */}
          <Summary data={dataSummary} />

          {/* Card 2 - Activity Breakdown */}
          <ActivityBreakdown data={dataActivity ?? []} />

          {/* Table Section */}
          <div className="min-h-[300px] flex flex-col bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={data}
              columns={columns}
              isLoading={isLoadingReportDetail}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: rekapReportDetailPagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              noDataText="Tidak ada data report logbook"
              className="min-h-[300px]"
            />
          </div>

          {/* Back Button */}
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <icons.ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
