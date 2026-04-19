import { StatusBadge } from "./StatusBadge";

interface LogbookDetail {
  ppds?: string | null;
  verifiedStatus?: string | null;
}

interface PPDSProps {
  detail: LogbookDetail | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

export const PPDS = ({ detail }: PPDSProps) => {
  return (
    <div className="sm:col-span-2 flex items-center gap-2">
      <span className="text-sm text-gray-500 w-24">PPDS</span>
      <span className="text-sm font-medium text-gray-800">
        {formatDisplayText(detail?.ppds)}
      </span>
      <StatusBadge status={detail?.verifiedStatus ?? null} type="ppds" />
    </div>
  );
};