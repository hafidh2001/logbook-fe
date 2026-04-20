import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { useRekapStore } from "@/store/rekapStore";
import { icons } from "@/assets/images/Icon";
import { useEffect } from "react";
import { Identitas } from "./_components/Identitas";
import { Kegiatan } from "./_components/Kegiatan";
import { SkorCatatan } from "./_components/SkorCatatan";

export default function RekapPenilaianDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const {
    rekapPenilaianDetail: data,
    isLoadingDetail,
    loadRekapPenilaianDetail,
    resetDetail,
  } = useRekapStore();

  useEffect(() => {
    if (idUser) {
      loadRekapPenilaianDetail(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadRekapPenilaianDetail, resetDetail]);

  const handleBack = () => {
    navigate(ROUTES.rekapPenilaian);
  };

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Penilaian", to: ROUTES.rekapPenilaian },
          { label: "Detail" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Card 1 - Identitas */}
          <Identitas data={data} />

          {/* Card 2 - Kegiatan */}
          <Kegiatan data={data} />

          {/* Card 3 - Skor & Catatan */}
          <SkorCatatan data={data} />

          {/* Back Button */}
          <div className="flex justify-end">
            <button
              onClick={handleBack}
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
