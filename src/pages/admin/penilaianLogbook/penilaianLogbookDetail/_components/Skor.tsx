interface PenilaianLogbookDetail {
  psikomotor?: string | null;
  knowledge?: string | null;
  afektif?: string | null;
  total?: string | null;
}

interface SkorProps {
  data: PenilaianLogbookDetail | null;
}

export const Skor = ({ data }: SkorProps) => {
  return (
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
              {data?.psikomotor ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Knowledge</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.knowledge ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Afektif</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.afektif ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-24">Total</span>
            <span className="text-sm font-medium text-gray-800">
              {data?.total ?? "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};