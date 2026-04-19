import { StatusBadge } from "./StatusBadge";

interface RekapLogbookDetail {
  ppds?: string | null;
  semester?: string | null;
  pin?: string | null;
  stase?: string | null;
}

interface IdentitasProps {
  data: RekapLogbookDetail | null;
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
        <span className="text-sm text-gray-500 w-24">PPDS</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.ppds)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Semester</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.semester)}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.pin)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Stase</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.stase)}
        </span>
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">PIN</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(data?.pin)}
        </span>
      </div>
      <div></div>
    </div>
  );
};