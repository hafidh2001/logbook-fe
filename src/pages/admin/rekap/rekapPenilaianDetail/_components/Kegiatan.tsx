interface RekapPenilaianDetail {
  action?: string | null;
  peran?: string | null;
  category?: string | null;
  title?: string | null;
}

interface KegiatanProps {
  data: RekapPenilaianDetail | null;
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
        <span className="text-sm text-gray-500 w-28">Action</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.action)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Peran</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.peran)}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Category</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.category)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Title</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.title)}
        </span>
      </div>
    </div>
  );
};