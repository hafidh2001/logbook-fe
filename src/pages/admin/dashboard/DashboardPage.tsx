import { Topbar } from "@/components/layout/Topbar";
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
  const { dashboardData: data, loadDashboard, reset } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
    return () => reset();
  }, [loadDashboard, reset]);

  if (!data) {
    return null;
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
              <ProfileCard teamName={data.team_name} year={data.year} />
            </div>

            {/* Stat Cards Grid - 70% */}
            <div className="lg:w-[70%] bg-white rounded-lg border overflow-hidden flex justify-center items-center">
              <div className="p-4 w-full overflow-x-auto">
                <StatCards data={data} />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogbookByStatusChart data={data.logbook_by_status} />
            <LogActivity items={data.log_aktivitas} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PPDSPerStage data={data.ppds_per_stage} />
            <PPDSPerStase data={data.ppds_per_stase} />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WaitingVerification items={data.menunggu_verifikasi} />
            <PPDSBaruChart data={data.ppds_baru_per_year} />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KinerjaDPJP items={data.kinerja_dpjp} />
            <KinerjaPPDS items={data.kinerja_ppds} />
          </div>
        </div>
      </div>
    </div>
  );
}
