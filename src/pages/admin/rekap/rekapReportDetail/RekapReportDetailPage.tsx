import { Topbar } from "@/components/ui/Topbar";
import { CardWrapper } from "@/components/ui/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import {
  BaseTable,
  type ExtendedColumnDef,
} from "@/components/basetable/BaseTable";
import { useEffect } from "react";
import { useRekapStore } from "@/store/rekapStore";
import { LoadingPage } from "@/components/ui/Loading";

interface LogbookItem {
  date: string;
  activity: string;
  title: string | null;
  stase: string;
  status: "pending" | "verified";
}

const StatusBadge = ({ status }: { status: string | null }) => {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
        -
      </span>
    );
  }

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
      {status}
    </span>
  );
};

export default function RekapReportDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();

  const {
    rekapReportDetail,
    isLoadingDetail,
    loadRekapReportDetail,
    resetDetail,
  } = useRekapStore();

  useEffect(() => {
    if (idUser) {
      loadRekapReportDetail(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadRekapReportDetail, resetDetail]);

  const handleExport = () => {
    // TODO: Implement export
  };

  const columns: ExtendedColumnDef<LogbookItem>[] = [
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
    },
    {
      accessorKey: "activity",
      header: "Activity",
      size: 200,
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 200,
      cell: ({ row: { original } }) => original.title || "-",
    },
    {
      accessorKey: "stase",
      header: "Stase",
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
    },
  ];

  return isLoadingDetail ? (
    <LoadingPage />
  ) : (
    <div className="h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Report", to: ROUTES.rekapReport },
          { label: "Detail" },
        ]}
        onExport={handleExport}
      />
      <div className="flex-1 px-4 sm:px-6 py-4 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header Title */}
          <div className="mb-4 flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Rekap Report - {rekapReportDetail?.ppds_name ?? "-"}
            </h1>
          </div>

          {/* Content - scrollable area */}
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="max-w-5xl mx-auto">
              {/* Card 1 - Summary */}
              <CardWrapper title="Summary" className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-28">Period</span>
                    <span className="text-sm font-medium text-gray-800">
                      {rekapReportDetail?.card_summary.period ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-28">
                      Total Logbooks
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {rekapReportDetail?.card_summary.total_logbooks ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-28">Semester</span>
                    <span className="text-sm font-medium text-gray-800">
                      {rekapReportDetail?.card_summary.semester ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-28">Status</span>
                    <span className="text-sm font-medium text-gray-800">
                      {rekapReportDetail?.card_summary.status ?? "-"}
                    </span>
                  </div>
                </div>
              </CardWrapper>

              {/* Card 2 - Activity Breakdown */}
              <CardWrapper title="Activity Breakdown" className="mb-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {rekapReportDetail?.activity_breakdown.map(
                    (item: { count: number; label: string }, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-lg">
                          {item.count}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </CardWrapper>

              {/* Table Section */}
              <div className="min-h-[300px] flex flex-col bg-white rounded-lg border overflow-hidden">
                <BaseTable
                  data={rekapReportDetail?.logbook_table.items ?? []}
                  columns={columns}
                  pagination={{
                    enabled: true,
                    initialPageSize: 10,
                  }}
                  isShowNumbering
                  noDataText="No logbook data available"
                  className="flex-1"
                />
              </div>

              {/* Back Button */}
              <div className="mt-4 flex justify-end">
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
      </div>
    </div>
  );
}
