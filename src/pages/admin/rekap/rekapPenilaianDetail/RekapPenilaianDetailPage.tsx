import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { mockRekapPenilaian } from "@/data/rekap";
import { icons } from "@/assets/images/Icon";

export default function RekapPenilaianDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const penilaian = mockRekapPenilaian.find((item) => item.id === Number(idUser));

  const formatDisplayText = (value: string | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return String(value);
  };

  const handleBack = () => {
    navigate(ROUTES.rekapPenilaian);
  };

  if (!penilaian) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
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

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
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
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Identitas
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Date Logbook</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.date_logbook)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">PPDS</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.ppds)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">NIM</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.nim)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Inisial Code</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.inisial_code)}
                  </span>
                </div>
                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Semester</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.semester)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Stase</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.stage)}
                  </span>
                </div>
                {/* Row 4 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">PIN</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.pin)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Staff</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.staff)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Kegiatan */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Kegiatan
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Action</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.action)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Peran</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.peran)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Category</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.category)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Title</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.title)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Skor & Catatan */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Skor & Catatan
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Psikomotor</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatNumber(penilaian.psikomotor)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Knowledge</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatNumber(penilaian.knowledge)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Afektif</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatNumber(penilaian.afektif)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-28">Total</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatNumber(penilaian.total)}
                  </span>
                </div>
                {/* Row 3 - Notes (full width) */}
                <div className="sm:col-span-2 flex items-start gap-2">
                  <span className="text-sm text-gray-500 w-28">Notes</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(penilaian.notes)}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
