import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import {
  BaseTable,
  type ExtendedColumnDef,
} from "@/components/basetable/BaseTable";

interface CardSummary {
  period: string;
  total_logbooks: number;
  semester: string;
  status: string;
}

interface ActivityBreakdown {
  count: number;
  label: string;
}

interface LogbookItem {
  date: string;
  activity: string;
  title: string | null;
  stase: string;
  status: "pending" | "verified";
}

interface ReportDetailData {
  ppds_name: string;
  card_summary: CardSummary;
  activity_breakdown: ActivityBreakdown[];
  logbook_table: {
    total: number;
    items: LogbookItem[];
  };
}

// Mock data - in real app this would come from API
const mockReportDetail: ReportDetailData = {
  ppds_name: "Chairul Arby Desiyanto",
  card_summary: {
    period: "1/4/2026 - 30/4/2026",
    total_logbooks: 41,
    semester: "Semester 8",
    status: "Active",
  },
  activity_breakdown: [
    { count: 28, label: "Kegiatan Poli Klinik" },
    { count: 11, label: "Kegiatan Bangsal" },
    { count: 2, label: "Kegiatan Kamar Operasi" },
  ],
  logbook_table: {
    total: 41,
    items: [
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "9/4/2026",
        activity: "Kegiatan Poli Klinik",
        title: null,
        stase: "RSDM OTK",
        status: "pending",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "8/4/2026",
        activity: "Kegiatan Bangsal",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "7/4/2026",
        activity: "Kegiatan Kamar Operasi",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
      {
        date: "7/4/2026",
        activity: "Kegiatan Kamar Operasi",
        title: null,
        stase: "RSDM OTK",
        status: "verified",
      },
    ],
  },
};

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
  const handleExport = () => {
    // TODO: Implement export
  };

  const { idUser:_ } = useParams<{ idUser: string }>();

  const { ppds_name, card_summary, activity_breakdown, logbook_table } =
    mockReportDetail;

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

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
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
              Detail Rekap Report - {ppds_name}
            </h1>
          </div>

          {/* Content - scrollable area */}
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="max-w-5xl mx-auto">
              {/* Card 1 - Summary */}
              <div className="bg-white rounded-lg border overflow-hidden mb-4">
                <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Summary
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-28">Period</span>
                      <span className="text-sm font-medium text-gray-800">
                        {card_summary.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-28">
                        Total Logbooks
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {card_summary.total_logbooks}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-28">
                        Semester
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {card_summary.semester}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-28">Status</span>
                      <span className="text-sm font-medium text-gray-800">
                        {card_summary.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Activity Breakdown */}
              <div className="bg-white rounded-lg border overflow-hidden mb-4">
                <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Activity Breakdown
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {activity_breakdown.map((item, index) => (
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
                    ))}
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="min-h-[300px] flex flex-col bg-white rounded-lg border overflow-hidden">
                <BaseTable
                  data={logbook_table.items}
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
