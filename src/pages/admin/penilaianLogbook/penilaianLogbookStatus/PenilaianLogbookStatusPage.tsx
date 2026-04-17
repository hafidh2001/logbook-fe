import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { usePenilaianLogbookStore } from "@/store/penilaianLogbookStore";
import { useEffect } from "react";

export default function PenilaianLogbookStatusPage() {
  const { idLogbookCategory } = useParams<{ idLogbookCategory: string }>();
  const navigate = useNavigate();

    const { penilaianList, loadPenilaianList, reset } = usePenilaianLogbookStore();
  
    useEffect(() => {
      loadPenilaianList();
      return () => reset();
    }, [loadPenilaianList, reset]);

  // Find data by category id
  const mockData = penilaianList.find((item) => item.id === Number(idLogbookCategory));

  const handleScoredClick = () => {
    navigate(ROUTES.penilaianLogbookScoredLogbook(idLogbookCategory || ""));
  };

  const handleUnscoredClick = () => {
    navigate(ROUTES.penilaianLogbookUnscoredLogbook(idLogbookCategory || ""));
  };

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
            {/* Scored Logbook Card */}
            <div
              className="bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleScoredClick}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <icons.FileText className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                    <icons.Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {mockData?.totalScored ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Scored Logbook</p>
                </div>
              </div>
            </div>

            {/* Unscored Logbook Card */}
            <div
              className="bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleUnscoredClick}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
                    <icons.FileText className="h-7 w-7 text-yellow-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center">
                    <icons.X className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {mockData?.totalUnscored ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Unscored Logbook</p>
                </div>
              </div>
            </div>
          </div>

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