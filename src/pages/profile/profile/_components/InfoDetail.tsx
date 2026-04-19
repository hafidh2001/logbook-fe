interface Profile {
  nama?: string;
  email?: string;
  telephoneNumber?: string;
  code?: string;
  tanggalLahir?: string | null;
  address?: string;
}

interface InfoDetailProps {
  profile: Profile | null;
}

export const InfoDetail = ({ profile }: InfoDetailProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Nama</span>
        <span className="text-sm font-medium text-gray-800">
          {profile?.nama ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Email</span>
        <span className="text-sm font-medium text-gray-800">
          {profile?.email || "-"}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">
          Telephone Number
        </span>
        <span className="text-sm font-medium text-gray-800">
          {profile?.telephoneNumber || "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {profile?.code || "-"}
        </span>
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">
          Tanggal Lahir
        </span>
        <span className="text-sm font-medium text-gray-800">
          {profile?.tanggalLahir || "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Address</span>
        <span className="text-sm font-medium text-gray-800">
          {profile?.address || "-"}
        </span>
      </div>
    </div>
  );
};