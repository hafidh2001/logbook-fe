import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { useRekapStore } from "@/store/rekapStore";
import { icons } from "@/assets/images/Icon";
import { useEffect } from "react";
import { Identitas } from "./_components/Identitas";
import { Kegiatan } from "./_components/Kegiatan";
import { Staff } from "./_components/Staff";

export default function RekapLogbookDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();

  const {
    rekapLogbookDetail: data,
    isLoadingDetail,
    loadRekapLogbookDetail,
    resetLogbookDetail,
  } = useRekapStore();

  useEffect(() => {
    if (idUser) {
      loadRekapLogbookDetail(Number(idUser));
    }
    return () => resetLogbookDetail();
  }, [idUser, loadRekapLogbookDetail, resetLogbookDetail]);

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Logbook", to: ROUTES.rekapLogbook },
          { label: "Detail" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Card 1 - Identitas */}
          <Identitas data={data} />

          {/* Card 2 - Kegiatan */}
          <Kegiatan data={data} />

          {/* Card 3 - Staff */}
          <Staff data={data} />

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
