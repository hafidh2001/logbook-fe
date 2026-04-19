import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useParams, useLocation } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { useEffect } from "react";
import { usePenilaianLogbookStore } from "@/store/penilaianLogbookStore";
import { Header } from "./_components/Header";
import { Identitas } from "./_components/Identitas";
import { Kegiatan } from "./_components/Kegiatan";
import { Skor } from "./_components/Skor";
import { Staff } from "./_components/Staff";

export default function PenilaianLogbookDetailPage() {
  const { idLogbookCategory, idLogbook } = useParams<{
    idLogbookCategory: string;
    idLogbook: string;
  }>();
  const location = useLocation();

  const { penilaianLogbookDetail, isLoadingDetail, loadPenilaianLogbookDetail, resetDetail } = usePenilaianLogbookStore();

  useEffect(() => {
    if (idLogbook) {
      loadPenilaianLogbookDetail(idLogbook);
    }
    return () => resetDetail();
  }, [idLogbook, loadPenilaianLogbookDetail, resetDetail]);

  const isScored = location.pathname.includes("/scored-logbook/");

  return isLoadingDetail ? (
    <LoadingPage />
  ) :(
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Penilaian Logbook", to: ROUTES.penilaianLogbook },
          {
            label: "Status",
            to: ROUTES.penilaianLogbookDetail(idLogbookCategory || ""),
          },
          {
            label: isScored ? "Scored" : "Unscored",
            to: isScored
              ? ROUTES.penilaianLogbookScoredLogbook(idLogbookCategory || "")
              : ROUTES.penilaianLogbookUnscoredLogbook(idLogbookCategory || ""),
          },
          { label: "Detail" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Header data={penilaianLogbookDetail} />
          <Identitas data={penilaianLogbookDetail} />
          <Kegiatan data={penilaianLogbookDetail} />
          <Skor data={penilaianLogbookDetail} />
          <Staff data={penilaianLogbookDetail} />

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