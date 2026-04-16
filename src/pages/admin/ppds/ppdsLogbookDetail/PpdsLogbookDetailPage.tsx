import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useLocation } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import dayjs from "dayjs";

interface Identitas {
  ppds: string;
  inisialCode: string | null;
  nim: string;
}

interface Kegiatan {
  date: string;
  catatan: string | null;
  activity: string;
  verifiedStatus: string | null;
  hospital: string | null;
}

// interface Staff {
//   staffPengajar: string | null;
//   staffStatus: "pending" | "verified";
// }

// Mock data - in real app this would come from API
const mockLogbookDetail = {
  identitas: {
    ppds: "Yudhistira",
    inisialCode: null,
    nim: "0101",
  } as Identitas,
  kegiatan: {
    date: "2026-04-06 14:00",
    catatan: "Tes",
    activity: "Kegiatan Poli Klinik",
    verifiedStatus: "pending",
    hospital: "RSUD DR Moewardi",
  } as Kegiatan,
  staff: {
    staffPengajar: "DIANTI STAFF",
    staffStatus: "pending" as const,
  },
};

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD MMM YYYY – HH:mm");
};

const StatusBadge = ({
  status,
  type = "verified",
}: {
  status: string | null;
  type?: "verified" | "staff";
}) => {
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
        {type === "staff" ? "Pending" : "Menunggu"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
      {status}
    </span>
  );
};

export default function PpdsLogbookDetailPage() {
  const { idUser, idLogbook: _ } = useParams<{
    idUser: string;
    idLogbook: string;
  }>();
  const location = useLocation();

  const isInactive = location.pathname.includes("/ppds-inactive/");

  const ppdsListRoute = isInactive ? ROUTES.ppdsInactive : ROUTES.ppds;
  const ppdsDetailRoute = isInactive
    ? ROUTES.ppdsInactiveDetail(idUser || "")
    : ROUTES.ppdsDetail(idUser || "");
  const ppdsLogbookRoute = isInactive
    ? ROUTES.ppdsInactiveLogbook(idUser || "")
    : ROUTES.ppdsLogbook(idUser || "");

  const { identitas, kegiatan, staff } = mockLogbookDetail;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar
        breadcrumbs={[
          { label: isInactive ? "PPDS Nonaktif" : "PPDS", to: ppdsListRoute },
          { label: "Detail", to: ppdsDetailRoute },
          { label: "Logbook", to: ppdsLogbookRoute },
          { label: "Detail", to: undefined },
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
                    {formatDisplayText(identitas.ppds)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">
                    Inisial Code
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(identitas.inisialCode)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">NIM</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(identitas.nim)}
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
                    {formatDate(kegiatan.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Catatan</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(kegiatan.catatan)}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Activity</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(kegiatan.activity)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">
                    Verified Status
                  </span>
                  <StatusBadge
                    status={kegiatan.verifiedStatus}
                    type="verified"
                  />
                </div>
                {/* Row 3 - Hospital (full width) */}
                <div className="sm:col-span-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Hospital</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(kegiatan.hospital)}
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
                <span className="text-sm text-gray-500 w-24">
                  Staff Pengajar
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {formatDisplayText(staff.staffPengajar)}
                </span>
                <StatusBadge status={staff.staffStatus} type="staff" />
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
