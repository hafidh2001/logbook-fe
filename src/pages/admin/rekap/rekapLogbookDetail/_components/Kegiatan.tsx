import { StatusBadge } from "./StatusBadge";

interface RekapLogbookDetail {
  date?: string | null;
  attachment?: string | null;
  activity?: string | null;
  status?: string | null;
  category?: string | null;
  patient?: string | null;
  peran?: string | null;
  diagnosis?: string | null;
  title?: string | null;
  treatment?: string | null;
}

interface KegiatanProps {
  data: RekapLogbookDetail | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

export const Kegiatan = ({ data }: KegiatanProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Date</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.date)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Catatan</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.attachment)}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Activity</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.activity)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Status</span>
        <StatusBadge status={data?.status ?? null} />
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Kategori</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.category)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Patient</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.patient)}
        </span>
      </div>
      {/* Row 4 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Peran</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.peran)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Diagnosis</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.diagnosis)}
        </span>
      </div>
      {/* Row 5 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Judul</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.title)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Treatment</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.treatment)}
        </span>
      </div>
    </div>
  );
};