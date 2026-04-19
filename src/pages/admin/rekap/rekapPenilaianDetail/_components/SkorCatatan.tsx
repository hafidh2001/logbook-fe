interface RekapPenilaianDetail {
  psikomotor?: number | null;
  knowledge?: number | null;
  afektif?: number | null;
  total?: number | null;
  notes?: string | null;
}

interface SkorCatatanProps {
  data: RekapPenilaianDetail | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return String(value);
};

export const SkorCatatan = ({ data }: SkorCatatanProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Psikomotor</span>
        <span className="text-sm font-medium text-gray-800">
          {formatNumber(data?.psikomotor)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Knowledge</span>
        <span className="text-sm font-medium text-gray-800">
          {formatNumber(data?.knowledge)}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Afektif</span>
        <span className="text-sm font-medium text-gray-800">
          {formatNumber(data?.afektif)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Total</span>
        <span className="text-sm font-medium text-gray-800">
          {formatNumber(data?.total)}
        </span>
      </div>
      {/* Row 3 - Notes (full width) */}
      <div className="sm:col-span-2 flex items-start gap-2">
        <span className="text-sm text-gray-500 w-28">Notes</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.notes)}
        </span>
      </div>
    </div>
  );
};