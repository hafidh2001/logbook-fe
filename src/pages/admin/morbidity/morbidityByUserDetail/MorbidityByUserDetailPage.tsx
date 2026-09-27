import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { useEffect } from "react";
import { Detail } from "./_components/Detail";
import { useMorbidityStore } from "@/store/morbidityStore";
import { Status } from "./_components/Status";

export default function MorbidityByUserDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const { idLogbook } = useParams<{ idLogbook: string }>();

  const {
    selectedMorbidityByUserDetail: data,
    isLoadingDetail,
    loadMorbidityByUserDetail,
    resetDetail,
  } = useMorbidityStore();

  useEffect(() => {
    if (idLogbook) {
      loadMorbidityByUserDetail(Number(idLogbook));
    }
    return () => resetDetail();
  }, [idLogbook, loadMorbidityByUserDetail, resetDetail]);

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Morbidity", to: ROUTES.morbidity },
          {
            label: `Morbidity By ${data?.display_name ?? "User"}`,
            to: ROUTES.morbidityByUser(String(idUser)),
          },
          { label: "Detail" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Card 1 - Detail */}
          <Detail data={data} />

          {/* Card 2 - Kegiatan */}
          <Status data={data} />

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
