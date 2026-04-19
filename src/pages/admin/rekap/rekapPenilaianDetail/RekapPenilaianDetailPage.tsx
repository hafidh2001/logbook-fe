import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { CardWrapper } from "@/components/card/cardWrapper";
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

  const { rekapPenilaianDetail, isLoadingDetail, loadRekapPenilaianDetail, resetDetail } = useRekapStore();

  useEffect(() => {
    if (idUser) {
      loadRekapPenilaianDetail(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadRekapPenilaianDetail, resetDetail]);

  const penilaian = rekapPenilaianDetail;

  const handleBack = () => {
    navigate(ROUTES.rekapPenilaian);
  };

  if (!penilaian) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
        <Topbar
          breadcrumbs={[
            { label: "Rekap" },
            { label: "Penilaian", to: ROUTES.rekapPenilaian },
            { label: "Detail" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-500 mb-4">Data penilaian dengan ID {idUser} tidak ditemukan</p>
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
    );
  }

  return isLoadingDetail ? (
    <LoadingPage />
  ) : (
    <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Penilaian", to: ROUTES.rekapPenilaian },
          { label: "Detail" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Identitas */}
          <CardWrapper title="Identitas" className="mb-4">
            <Identitas data={penilaian} />
          </CardWrapper>

          {/* Card 2 - Kegiatan */}
          <CardWrapper title="Kegiatan" className="mb-4">
            <Kegiatan data={penilaian} />
          </CardWrapper>

          {/* Card 3 - Skor & Catatan */}
          <CardWrapper title="Skor & Catatan" className="mb-4">
            <SkorCatatan data={penilaian} />
          </CardWrapper>

          {/* Back Button */}
          <div className="mt-4 flex justify-end">
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