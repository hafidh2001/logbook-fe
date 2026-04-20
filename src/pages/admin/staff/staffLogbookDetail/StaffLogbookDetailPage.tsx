import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { CardWrapper } from "@/components/card/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { useEffect } from "react";
import { useLogbookStore } from "@/store/logbookStore";
import { Identitas } from "./_components/Identitas";
import { Kegiatan } from "./_components/Kegiatan";
import { PPDS } from "./_components/PPDS";

export default function StaffLogbookDetailPage() {
  const { idUser, idLogbook } = useParams<{
    idUser: string;
    idLogbook: string;
  }>();

  const {
    staffLogbook,
    staffLogbookDetail,
    isLoadingDetail,
    loadStaffLogbook,
    loadStaffLogbookDetail,
    resetDetail,
  } = useLogbookStore();

  useEffect(() => {
    if (idUser) {
      loadStaffLogbook(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadStaffLogbook, resetDetail]);

  useEffect(() => {
    if (idUser && idLogbook) {
      loadStaffLogbookDetail(idUser, idLogbook);
    }
  }, [idUser, idLogbook, loadStaffLogbookDetail]);

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(String(idUser)) },
          { label: "Logbook", to: ROUTES.staffLogbook(String(idUser)) },
          { label: "Detail" },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Identitas */}
          <Identitas data={staffLogbook?.participant ?? null} />

          {/* Card 2 - Kegiatan */}
          <Kegiatan data={staffLogbookDetail} />

          {/* Card 3 - PPDS */}
          <PPDS data={staffLogbookDetail} />

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
