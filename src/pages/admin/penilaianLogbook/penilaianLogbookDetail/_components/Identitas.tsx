interface PenilaianLogbookDetail {
  ppds?: string | null;
  semester?: string | null;
  code?: string | null;
}

interface IdentitasProps {
  data: PenilaianLogbookDetail | null;
}

export const Identitas = ({ data }: IdentitasProps) => {
  return (
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
              {data?.ppds ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Semester</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.semester ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Code</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.code ?? "-"}
            </span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};