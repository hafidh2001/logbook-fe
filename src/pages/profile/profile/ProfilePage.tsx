import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { Button } from "@/components/ui/button";

// Mock data - in real app this would come from API
const mockProfileData = {
  displayName: "DIANTI INSTITUSI",
  role: "institution",
  nama: "Dianti Kusuma",
  email: "dianti@email.com",
  telephoneNumber: "08123456789",
  code: "DIANTI001",
  tanggalLahir: null as string | null,
  address: "Jakarta, Indonesia",
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(ROUTES.profileEdit);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar
        breadcrumbs={[{ label: "Profil" }]}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Profile Header */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Profil
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <icons.User className="h-11 w-11 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {mockProfileData.displayName}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      Role: {mockProfileData.role}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleEditProfile}
                  className="w-full sm:w-auto"
                >
                  <icons.Pencil className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Card 2 - Info Detail */}
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Info Detail
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-36">Nama</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockProfileData.nama}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-36">Email</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockProfileData.email}
                  </span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-36">Telephone Number</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockProfileData.telephoneNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-36">Code</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockProfileData.code}
                  </span>
                </div>
                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-36">Tanggal Lahir</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockProfileData.tanggalLahir || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-36">Address</span>
                  <span className="text-sm font-medium text-gray-800">
                    {mockProfileData.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
