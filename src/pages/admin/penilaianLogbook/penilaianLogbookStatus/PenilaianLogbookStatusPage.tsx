import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { usePenilaianLogbookStore } from "@/store/penilaianLogbookStore";
import { useEffect } from "react";
import { StatusCard } from "./_components/StatusCard";

export default function PenilaianLogbookStatusPage() {
  const { idLogbookCategory } = useParams<{ idLogbookCategory: string }>();
  const navigate = useNavigate();

  const {
    penilaianLogbookDetail,
    isLoading,
    loadPenilaianLogbookDetail,
    reset,
  } = usePenilaianLogbookStore();

  useEffect(() => {
    if (idLogbookCategory) {
      loadPenilaianLogbookDetail({ id_action: Number(idLogbookCategory) });
    }
    return () => reset();
  }, [idLogbookCategory, loadPenilaianLogbookDetail, reset]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Penilaian Logbook", to: ROUTES.penilaianLogbook },
          { label: "Status" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatusCard
              icon={icons.FileText}
              badgeIcon={icons.Check}
              color="green"
              value={penilaianLogbookDetail?.scored ?? 0}
              title="Scored Logbook"
              onClick={() => navigate(ROUTES.penilaianLogbookScoredLogbook(idLogbookCategory || ""))}
            />
            <StatusCard
              icon={icons.FileText}
              badgeIcon={icons.X}
              color="yellow"
              value={penilaianLogbookDetail?.unscored ?? 0}
              title="Unscored Logbook"
              onClick={() => navigate(ROUTES.penilaianLogbookUnscoredLogbook(idLogbookCategory || ""))}
            />
          </div>

          {/* Back Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate(ROUTES.penilaianLogbook)}
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