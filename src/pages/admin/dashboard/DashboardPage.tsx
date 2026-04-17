import { Topbar } from "@/components/ui/Topbar";
import { CardWrapper } from "@/components/ui/cardWrapper";
import { DashboardIcon } from "@/assets/images/DashboardIcon";
import { icons } from "@/assets/images/Icon";
import { useDashboardStore } from "@/store/dashboardStore";
import { BarChart } from "@/components/chart/barChart";
import { DoughnutChart } from "@/components/chart/doughnutChart";
import { LineChart } from "@/components/chart/lineChart";
import type { ChartData } from "chart.js";
import { useEffect } from "react";

export default function DashboardPage() {
  const { dashboardData: data, loadDashboard, reset } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
    return () => reset();
  }, [loadDashboard, reset]);

  if (!data) {
    return null;
  }

  // Bar Chart data for logbook by status
  const barChartData: ChartData<"bar", number[], string> = {
    labels: data.logbook_by_status.map((item) => item.status),
    datasets: [
      {
        data: data.logbook_by_status.map((item) => item.count),
        backgroundColor: ["#81C784", "#E57373", "#64B5F6", "#FFD54F"],
        borderRadius: 6,
      },
    ],
  };

  // Doughnut chart for ppds per stage
  const doughnutStageData: ChartData<"doughnut", number[], string> = {
    labels: data.ppds_per_stage.map((item) => item.stage),
    datasets: [
      {
        data: data.ppds_per_stage.map((item) => item.count),
        backgroundColor: ["#6C63FF", "#81C784", "#64B5F6"],
        borderWidth: 0,
      },
    ],
  };

  // Doughnut chart for ppds per stase
  const doughnutStaseData: ChartData<"doughnut", number[], string> = {
    labels: data.ppds_per_stase.map((item) => item.stase),
    datasets: [
      {
        data: data.ppds_per_stase.map((item) => item.count),
        backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        borderWidth: 0,
      },
    ],
  };

  // Line chart for ppds baru per year
  const lineChartData: ChartData<"line", number[], string> = {
    labels: data.ppds_baru_per_year.map((item) => item.year),
    datasets: [
      {
        data: data.ppds_baru_per_year.map((item) => item.count),
        borderColor: "#14B8A6",
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#14B8A6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex-1 px-4 sm:px-6 py-4 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Row 1 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Card - 30% */}
            <div className="lg:w-[30%] bg-white rounded-lg border overflow-hidden flex justify-center items-center">
              <div className="p-6 flex items-center gap-6">
                <div className="flex-shrink-0">
                  <DashboardIcon className="w-24 h-24" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {data.team_name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Tahun Ajaran {data.year}
                  </p>
                </div>
              </div>
            </div>

            {/* Stat Cards Grid - 70% */}
            <div className="lg:w-[70%] bg-white rounded-lg border overflow-hidden flex justify-center items-center">
              <div className="p-4 w-full overflow-x-auto">
                <div className="flex gap-4 min-w-max lg:min-w-full">
                  {/* Active PPDS */}
                  <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                        <icons.Users className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-xl font-bold text-gray-800">
                        {data.active_ppds_count}
                      </span>
                      <span className="text-xs text-gray-500">
                        of {data.total_ppds}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">Active PPDS</p>
                    <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline truncate text-center">
                      {data.inactive_ppds_count} Inactive PPDS
                    </p>
                  </div>

                  {/* Activity */}
                  <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                        <icons.NotebookPen className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 block text-center">
                      {data.activity_count}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 text-center">Activity</p>
                  </div>

                  {/* Staff Pengajar */}
                  <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                        <icons.Users className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 block text-center">
                      {data.staff_pengajar_count}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 text-center">Staff Pengajar</p>
                  </div>

                  {/* Stage */}
                  <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                        <icons.Pencil className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 block text-center">
                      {data.stage_count}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 text-center">Stage</p>
                  </div>

                  {/* Logbook */}
                  <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                        <icons.Book className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 block text-center">
                      {data.logbook_count}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 text-center">Logbook</p>
                    <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline truncate text-center">
                      {data.unverified_logbook_count} Unverified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Logbook by Status */}
            <CardWrapper
              title="Jumlah Logbook dan Status"
              className="flex flex-col"
              contentClassName="flex-1 overflow-x-auto flex justify-center items-center"
            >
              <div className="min-w-full h-full">
                <BarChart
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardWrapper>

            {/* Scrollable List - Log Aktivitas */}
            <CardWrapper title="Log Aktivitas">
              <div className="max-h-72 overflow-y-auto">
                <div className="space-y-3">
                  {data.log_aktivitas.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <icons.Calendar className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-gray-700">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardWrapper>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doughnut Chart - PPDS Per Stage */}
            <CardWrapper title="PPDS Per Stage">
              <div className="h-72 flex items-center justify-center">
                <div className="w-full sm:w-[270px]">
                  <DoughnutChart
                    data={doughnutStageData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </CardWrapper>

            {/* Doughnut Chart - PPDS Per Stase */}
            <CardWrapper title="PPDS Per Stase">
              <div className="h-72 flex items-center justify-center">
                <div className="w-full sm:w-[270px]">
                  <DoughnutChart
                    data={doughnutStaseData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </CardWrapper>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scrollable List - Menunggu Verifikasi */}
            <CardWrapper title="Menunggu Verifikasi">
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-3">
                  {data.menunggu_verifikasi.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.activity}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <icons.User className="h-3 w-3" />
                            {item.staff}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <icons.Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardWrapper>

            {/* Line Chart - PPDS Baru */}
            <CardWrapper
              title="Jumlah PPDS Baru"
              className="flex flex-col"
              contentClassName="flex-1 overflow-x-auto flex justify-center items-center"
            >
              <div className="min-w-full h-full">
                <LineChart
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardWrapper>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kinerja DPJP */}
            <CardWrapper title="Kinerja DPJP">
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-3">
                  {data.kinerja_dpjp.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                          <icons.User className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <icons.NotebookPen className="h-3 w-3" />
                          {item.total_logbook}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                          <icons.Clock className="h-3 w-3" />
                          {item.pending}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <icons.Check className="h-3 w-3" />
                          {item.verified}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardWrapper>

            {/* Kinerja PPDS */}
            <CardWrapper title="Kinerja PPDS">
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-3">
                  {data.kinerja_ppds.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <icons.User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.stase}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <icons.Check className="h-3 w-3" />
                        {item.verified_count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
