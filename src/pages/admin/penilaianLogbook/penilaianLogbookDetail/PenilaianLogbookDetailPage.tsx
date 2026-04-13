import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useLocation } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { mockPenilaianLogbookStatusList } from "@/data/penilaianLogbook";

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const StatusBadge = ({ status }: { status: "pending" | "verified" | null }) => {
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
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
      {status}
    </span>
  );
};

// Mock staff data - in real app this would come from API
const mockStaffList = [
  {
    id: 1,
    role: "Pembimbing 1",
    name: "DIANTI STAFF",
    status: "pending" as const,
  },
  { id: 2, role: "Penguji 1", name: "dr. Test 1", status: "verified" as const },
];

export default function PenilaianLogbookDetailPage() {
  const { idLogbookCategory, idLogbook } = useParams<{
    idLogbookCategory: string;
    idLogbook: string;
  }>();
  const location = useLocation();

  // Determine if scored or unscored based on URL path
  const isScored = location.pathname.includes("/scored-logbook/");

  // Find mock data by id
  const numericId = Number(idLogbook);
  const mockData = mockPenilaianLogbookStatusList.find(
    (item) => item.id === numericId,
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          {/* Card 0 - Profile Header */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <icons.User className="h-9 w-9 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {formatDisplayText(mockData?.ppds)}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatDisplayText(mockData?.code) || "-"}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                      {formatDisplayText(mockData?.semester)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1 - Identitas */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Identitas
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">PPDS</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.ppds)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Semester</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.semester)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Code</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.code)}
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Date</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Peran</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.pin)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Activity</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.activity)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Judul</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.title)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Stase</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.stase)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Catatan</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatDisplayText(mockData?.pin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Skor */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Skor
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Psikomotor</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockData?.psikomotor ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Knowledge</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockData?.knowledge ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Afektif</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockData?.afektif ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-24">Total</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockData?.total ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Staff */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Staff
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-3">
                {mockStaffList.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-800 block">
                        {staff.role}
                      </span>
                      <span className="text-sm text-gray-600">
                        {staff.name}
                      </span>
                    </div>
                    <StatusBadge status={staff.status} />
                  </div>
                ))}
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
