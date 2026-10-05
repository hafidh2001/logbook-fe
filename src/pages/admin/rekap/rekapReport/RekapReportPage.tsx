import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Filter } from "./_components/Filter";
import { BaseTable } from "@/components/basetable/BaseTable";
import { useRekapStore } from "@/store/rekapStore";
import { useAuthStore } from "@/store/authStore";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/table";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { TRekapReportItem } from "@/types/rekap";
import dayjs from "dayjs";
import { Summary } from "@/pages/admin/rekap/rekapReport/_components/Summary";
import { ExportFormat } from "@/components/exportButton";
import { showToast } from "@/utils/toast";
import { ExportColumn, exportToCSV, exportToExcel } from "@/functions/export";
import { ExportModal } from "@/components/exportModal/ExportModal";

export default function RekapReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const defaultEndDate = dayjs().endOf("month").format("YYYY-MM-DD");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!params.has("start_date")) {
      params.set("start_date", defaultStartDate);
      changed = true;
    }

    if (!params.has("end_date")) {
      params.set("end_date", defaultEndDate);
      changed = true;
    }

    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, []);

  const { width } = useWindowDimensions();
  const sm = width >= 480;
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const {
    rekapReport,
    rekapReportSummary,
    rekapReportPagination,
    isLoadingReport,
    isExportingReport,
    loadRekapReport,
    loadExportRekapReport,
    cancelExportReport,
    resetReport,
  } = useRekapStore();

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOffset, setExportOffset] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const exportControllerRef = useRef<AbortController | null>(null);

  // ========== URL PARAMS (using useUrlParams hook) ==========
  // Note: Rekap uses string-based filters (name as value), not numeric IDs
  const { page, limit, filters, setLimit, setFilters, resetParams } =
    useUrlParams({
      defaultPage: 1,
      defaultLimit: DEFAULT_PAGE_SIZE,
      filterKeys: ["start_date", "end_date"],
      searchDebounceMs: 500,
    });

  // Extract filter values from URL (string-based for Rekap)
  const start_date = filters.start_date as string | undefined;
  const end_date = filters.end_date as string | undefined;

  // ========== HANDLERS ==========

  const handleFilterChange = (newFilters: {
    start_date?: string;
    end_date?: string;
  }) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    resetParams();
  };

  // ========== DATA FETCHING ==========

  useEffect(() => {
    if (user?.id_client) {
      loadRekapReport({
        id_client: user.id_client,
        page,
        limit,
        start_date,
        end_date,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, start_date, end_date]);

  useEffect(() => {
    return () => resetReport();
  }, [resetReport]);

  const handleExport = async (format: ExportFormat) => {
    // Create new AbortController for this export
    exportControllerRef.current = new AbortController();

    setExportProgress(0);
    setExportOffset(0);
    setIsExportComplete(false);
    setShowExportModal(true);

    try {
      const allData = await loadExportRekapReport({
        filterParams: {
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
      const exportColumns: ExportColumn<TRekapReportItem>[] = [
        { header: "No", accessorKey: "no" },
        { header: "Nama", accessorKey: "name" },
        { header: "Status", accessorKey: "status" },
        { header: "Role", accessorKey: "role" },
        { header: "Semester", accessorKey: "semester" },
        { header: "Jaga / IGD / Emergency", accessorKey: "jaga_igd_emergency" },
        { header: "Ilmiah Stase", accessorKey: "ilmiah_stase" },
        { header: "Poli Klinik", accessorKey: "poli_klinik" },
        { header: "Kamar Operasi", accessorKey: "kamar_operasi" },
        { header: "Seminar Hasil", accessorKey: "seminar_hasil" },
        { header: "Review Artikel", accessorKey: "review_artikel" },
        { header: "Proposal Thesis", accessorKey: "proposal_thesis" },
        { header: "Exam", accessorKey: "exam" },
        { header: "Stase", accessorKey: "stase" },
        { header: "Bimbingan Operasi", accessorKey: "bimbingan_operasi" },
        { header: "Kegiatan Bangsal", accessorKey: "kegiatan_bangsal" },
        { header: "Publikasi", accessorKey: "publikasi" },
        { header: "Ilmiah Non Stase", accessorKey: "ilmiah_non_stase" },
        { header: "Course", accessorKey: "course" },
        { header: "Ekstrakulikuler", accessorKey: "ekstrakulikuler" },
        { header: "Pengabdian", accessorKey: "pengabdian_masyarakat" },
        { header: "Total", accessorKey: "total" },
      ];

      const summaryRows = [
        {
          label: "Total PPDS",
          value: rekapReportSummary.total_ppds,
        },
        {
          label: "Total Logbooks",
          value: rekapReportSummary.total_logbooks,
        },
        {
          label: "Date Range",
          value: `${dayjs(start_date).locale("id").format("DD MMM YYYY")} - ${dayjs(end_date).locale("id").format("DD MMM YYYY")}`,
        },
      ];

      // Prepare data with index number
      const dataWithIndex = allData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      const filename = `rekap_report_${dayjs().format("YYYY-MM-DD")}`;

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
      cancelExportReport();
    }
    setShowExportModal(false);
    setIsExportComplete(false);
    exportControllerRef.current = null;
  };

  const handleOkExport = () => {
    setShowExportModal(false);
    setIsExportComplete(false);
  };

  const handlePaginationChange = (_pageIndex: number, pageSize: number) => {
    setLimit(pageSize, false);
  };

  const handleRowClick = (row: Row<TRekapReportItem>) => {
    navigate(ROUTES.rekapReportDetail(String(row.original.id)));
  };

  const handleView = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(ROUTES.rekapReportDetail(String(id)));
  };

  // Define columns for Rekap Penilaian table

  // Define columns for Rekap Report table
  const columns: ColumnDef<TRekapReportItem>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      size: 200,
      cell: ({ row: { original } }) => (
        <span className="font-medium">{original.name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      cell: ({ row: { original } }) => (
        <div className="flex items-center justify-center">
          <span className="text-center capitalize">
            {original.status ?? "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 150,
      cell: ({ row: { original } }) => (
        <div className="flex items-center justify-center">
          <span className="text-center capitalize">{original.role ?? "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "semester",
      header: "Semester",
      size: 120,
      cell: ({ row: { original } }) => original.semester ?? "-",
    },
    {
      accessorKey: "jaga_igd_emergency",
      header: "Jaga / IGD / Emergency",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.jaga_igd_emergency ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "ilmiah_stase",
      header: "Ilmiah Stase",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.ilmiah_stase ?? 0}</span>
      ),
    },
    {
      accessorKey: "poli_klinik",
      header: "Poli Klinik",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.poli_klinik ?? 0}</span>
      ),
    },
    {
      accessorKey: "kamar_operasi",
      header: "Kamar Operasi",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.kamar_operasi ?? 0}</span>
      ),
    },
    {
      accessorKey: "seminar_hasil",
      header: "Seminar Hasil",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.seminar_hasil ?? 0}</span>
      ),
    },
    {
      accessorKey: "review_artikel",
      header: "Review Artikel",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.review_artikel ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "proposal_thesis",
      header: "Proposal Thesis",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.proposal_thesis ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "exam",
      header: "Exam",
      size: 80,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.exam ?? 0}</span>
      ),
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 80,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.stase ?? 0}</span>
      ),
    },
    {
      accessorKey: "bimbingan_operasi",
      header: "Bimbingan Operasi",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.bimbingan_operasi ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "kegiatan_bangsal",
      header: "Kegiatan Bangsal",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.kegiatan_bangsal ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "publikasi",
      header: "Publikasi",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.publikasi ?? 0}</span>
      ),
    },
    {
      accessorKey: "ilmiah_non_stase",
      header: "Ilmiah Non Stase",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.ilmiah_non_stase ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "course",
      header: "Course",
      size: 80,
      cell: ({ row: { original } }) => (
        <span className="text-center block">{original.course ?? 0}</span>
      ),
    },
    {
      accessorKey: "ekstrakulikuler",
      header: "Ekstrakulikuler",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.ekstrakulikuler ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "pengabdian_masyarakat",
      header: "Pengabdian",
      size: 150,
      cell: ({ row: { original } }) => (
        <span className="text-center block">
          {original.pengabdian_masyarakat ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 80,
      cell: ({ row: { original } }) => (
        <span className="text-center block font-medium">
          {original.total ?? 0}
        </span>
      ),
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
              className="bg-[#087F5B] text-white hover:bg-[#066649]"
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
      <ExportModal
        isShown={showExportModal}
        progress={exportProgress}
        offset={exportOffset}
        total={rekapReportPagination.total}
        isComplete={isExportComplete}
        onCancel={handleCancelExport}
        onOk={handleOkExport}
      />

      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Report", to: ROUTES.rekapReport },
        ]}
        onExport={handleExport}
        isLoading={isExportingReport}
      />

      <div className="flex-1 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="h-full flex flex-col gap-2">
          {/* Filter Section */}
          <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-between gap-2">
            <Summary data={rekapReportSummary} />
            <Filter onChange={handleFilterChange} onReset={handleFilterReset} />
          </div>

          {/* Table Section */}
          <div className="flex-1 min-h-0 bg-white rounded-lg border overflow-hidden">
            <BaseTable
              data={rekapReport}
              columns={columns}
              isLoading={isLoadingReport}
              isShowNumbering
              pagination={{
                enabled: true,
                mode: "server",
                initialPageIndex: 0,
                initialPageSize: DEFAULT_PAGE_SIZE,
                pageCount: rekapReportPagination.pageCount ?? 1,
              }}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
              noDataText="Tidak ada data report"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
