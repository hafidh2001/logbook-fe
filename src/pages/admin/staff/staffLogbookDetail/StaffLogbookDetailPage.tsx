import { Topbar } from "@/components/ui/Topbar";
import { CardWrapper } from "@/components/ui/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import dayjs from "dayjs";
import "dayjs/locale/id";

interface Identitas {
  displayName: string;
  code: string | null;
}

interface Kegiatan {
  date: string;
  notes: string | null;
  activity: string;
  verifiedStatus: string | null;
  hospital: string | null;
}

// interface Ppds {
//   ppds: string | null;
//   verifiedStatus: "pending" | "verified";
// }

// Mock data - in real app this would come from API
const mockLogbookDetail = {
  identitas: {
    displayName: "DIANTI STAFF",
    code: "12345",
  } as Identitas,
  kegiatan: {
    date: "2026-04-06 14:00",
    notes: "Tes",
    activity: "Kegiatan Poli Klinik",
    verifiedStatus: "pending",
    hospital: "RSUD DR Moewardi",
  } as Kegiatan,
  ppds: {
    ppds: "Ujang",
    verifiedStatus: "pending" as const,
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
  type?: "verified" | "ppds";
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
        {type === "ppds" ? "Pending" : "Menunggu"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
      {status}
    </span>
  );
};

export default function StaffLogbookDetailPage() {
  const { idUser, idLogbook: _ } = useParams<{
    idUser: string;
    idLogbook: string;
  }>();

  const { identitas, kegiatan, ppds } = mockLogbookDetail;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(String(idUser)) },
          { label: "Logbook", to: ROUTES.staffLogbook(String(idUser)) },
          { label: "Detail", to: undefined },
        ]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Identitas */}
          <CardWrapper title="Identitas" className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Row 1 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-24">Nama</span>
                <span className="text-sm font-medium text-gray-800">
                  {formatDisplayText(identitas.displayName)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-24">Code</span>
                <span className="text-sm font-medium text-gray-800">
                  {formatDisplayText(identitas.code)}
                </span>
              </div>
            </div>
          </CardWrapper>

          {/* Card 2 - Kegiatan */}
          <CardWrapper title="Kegiatan" className="mb-4">
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
                  {formatDisplayText(kegiatan.notes)}
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
          </CardWrapper>

          {/* Card 3 - PPDS */}
          <CardWrapper title="PPDS" className="mb-4">
            <div className="sm:col-span-2 flex items-center gap-2">
              <span className="text-sm text-gray-500 w-24">PPDS</span>
              <span className="text-sm font-medium text-gray-800">
                {formatDisplayText(ppds.ppds)}
              </span>
              <StatusBadge status={ppds.verifiedStatus} type="ppds" />
            </div>
          </CardWrapper>

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
