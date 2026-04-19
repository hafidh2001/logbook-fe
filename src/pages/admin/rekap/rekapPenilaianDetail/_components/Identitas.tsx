interface RekapPenilaianDetail {
  date_logbook?: string | null;
  ppds?: string | null;
  nim?: string | null;
  inisial_code?: string | null;
  semester?: string | null;
  stage?: string | null;
  pin?: string | null;
  staff?: string | null;
}

interface IdentitasProps {
  data: RekapPenilaianDetail | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

export const Identitas = ({ data }: IdentitasProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Date Logbook</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.date_logbook)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">PPDS</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.ppds)}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">NIM</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.nim)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Inisial Code</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.inisial_code)}
        </span>
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Semester</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.semester)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Stase</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.stage)}
        </span>
      </div>
      {/* Row 4 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">PIN</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.pin)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Staff</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.staff)}
        </span>
      </div>
    </div>
  );
};