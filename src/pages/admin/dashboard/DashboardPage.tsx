import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { useDashboardStore } from "@/store/dashboardStore";
import { useEffect } from "react";

// Components
import { ProfileCard } from "./_components/ProfileCard";
import { StatCards } from "./_components/StatCards";
import { LogbookByStatusChart } from "./_components/LogbookByStatusChart";
import { LogActivity } from "./_components/LogActivity";
import { PPDSPerStage } from "./_components/PPDSPerStage";
import { PPDSPerStase } from "./_components/PPDSPerStase";
import { WaitingVerification } from "./_components/WaitingVerification";
import { PPDSBaruChart } from "./_components/PPDSBaruChart";
import { KinerjaDPJP } from "./_components/KinerjaDPJP";
import { KinerjaPPDS } from "./_components/KinerjaPPDS";

export default function DashboardPage() {
  const {
    dashboardData: data,
    isLoading,
    loadDashboard,
    reset,
  } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
    return () => reset();
  }, [loadDashboard, reset]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex-1 px-4 sm:px-6 py-4 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Row 1 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Card - 30% */}
            <div className="lg:w-[30%] bg-white rounded-lg border overflow-hidden flex justify-center items-center">
              <ProfileCard />
            </div>

            {/* Stat Cards Grid - 70% */}
            <div className="lg:w-[70%] bg-white rounded-lg border overflow-hidden flex justify-center items-center">
              <div className="p-4 w-full overflow-x-auto">
                <StatCards data={data ?? null} />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogbookByStatusChart data={data?.logbook_by_status ?? null} />
            <LogActivity items={data?.log_aktivitas ?? null} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PPDSPerStage data={data?.ppds_per_stage ?? null} />
            <PPDSPerStase data={data?.ppds_per_stase ?? null} />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WaitingVerification items={data?.menunggu_verifikasi ?? null} />
            <PPDSBaruChart data={data?.ppds_baru_per_year ?? null} />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KinerjaDPJP items={data?.kinerja_dpjp ?? null} />
            <KinerjaPPDS items={data?.kinerja_ppds ?? null} />
          </div>
        </div>
      </div>
    </div>
  );
}
