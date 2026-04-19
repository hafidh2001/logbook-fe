interface PenilaianLogbookDetail {
  date?: string | null;
  pin?: string | null;
  activity?: string | null;
  title?: string | null;
  stase?: string | null;
  notes?: string | null;
}

interface KegiatanProps {
  data: PenilaianLogbookDetail | null;
}

export const Kegiatan = ({ data }: KegiatanProps) => {
  return (
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
              {data?.date ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Peran</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.pin ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Activity</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.activity ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Judul</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.title ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Stase</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.stase ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Catatan</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.pin ?? "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};