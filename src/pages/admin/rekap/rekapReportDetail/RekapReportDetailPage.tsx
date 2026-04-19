import { Topbar } from "@/components/layout/Topbar";
import { CardWrapper } from "@/components/card/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import {
  BaseTable,
  type ExtendedColumnDef,
} from "@/components/basetable/BaseTable";
import { useEffect } from "react";
import { useRekapStore } from "@/store/rekapStore";
import { LoadingPage } from "@/components/layout/Loading";
import { StatusBadge } from "./_components/StatusBadge";
import { Summary } from "./_components/Summary";
import { ActivityBreakdown } from "./_components/ActivityBreakdown";

interface LogbookItem {
  date: string;
  activity: string;
  title: string | null;
  stase: string;
  status: "pending" | "verified";
}

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
      <div className="flex-1 px-4 sm:px-6 py-4 overflow-auto min-h-0">
        <div className="max-w-5xl mx-auto">
          {/* Header Title */}
          <div className="mb-4 flex-shrink-0 max-w-5xl">
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Rekap Report - {rekapReportDetail?.ppds_name ?? "-"}
            </h1>
          </div>

          {/* Card 1 - Summary */}
          <CardWrapper title="Summary" className="mb-4">
            <Summary data={rekapReportDetail} />
          </CardWrapper>

          {/* Card 2 - Activity Breakdown */}
          <CardWrapper title="Activity Breakdown" className="mb-4">
            <ActivityBreakdown
              items={rekapReportDetail?.activity_breakdown ?? []}
            />
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
  );
}
