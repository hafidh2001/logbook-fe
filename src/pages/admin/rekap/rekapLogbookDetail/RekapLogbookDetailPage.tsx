import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { mockRekapLogbook } from "@/data/rekap";
import { icons } from "@/assets/images/Icon";

export default function RekapLogbookDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const logbook = mockRekapLogbook.find((item) => item.id === Number(idUser));

  const formatDisplayText = (value: string | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  const StatusBadge = ({ status }: { status: string | null }) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
          -
        </span>
      );
    }

    if (status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
          <icons.Check className="h-3 w-3" />
          Terverifikasi
        </span>
      );
    }

    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
          <icons.Clock className="h-3 w-3" />
          Menunggu
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
        {status}
      </span>
    );
  };

  const handleBack = () => {
    navigate(ROUTES.rekapLogbook);
  };

  if (!logbook) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <Topbar
          breadcrumbs={[
            { label: "Rekap" },
            { label: "Logbook", to: ROUTES.rekapLogbook },
            { label: "Detail" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-500 mb-4">Data logbook dengan ID {idUser} tidak ditemukan</p>
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
          { label: "Logbook", to: ROUTES.rekapLogbook },
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
                  <span className="text-sm text-gray-500 w-24">PPDS</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.ppds)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Semester</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.semester)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Code</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.pin)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Stase</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.stase)}
                  </span>
                </div>
                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">PIN</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.pin)}
                  </span>
                </div>
                <div></div>
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
                  <span className="text-sm text-gray-500 w-24">Date</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Catatan</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.attachment)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Activity</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.activity)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Status</span>
                  <StatusBadge status={logbook.status} />
                </div>
                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Kategori</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.category)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Patient</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.patient)}
                  </span>
                </div>
                {/* Row 4 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Peran</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.peran)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Diagnosis</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.diagnosis)}
                  </span>
                </div>
                {/* Row 5 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Judul</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.title)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Treatment</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(logbook.treatment)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Staff */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Staff
              </h3>
            </div>
            <div className="p-4">
              <div className="sm:col-span-2 flex items-center gap-2">
                <span className="text-sm text-gray-500 w-24">Staff Pengajar</span>
                <span className="text-sm font-medium text-gray-800">
                  {formatDisplayText(logbook.staff_pengajar)}
                </span>
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
