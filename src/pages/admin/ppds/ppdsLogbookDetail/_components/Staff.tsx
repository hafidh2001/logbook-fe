import { StatusBadge } from "./StatusBadge";

interface LogbookDetail {
  staffPengajar?: string | null;
  verifiedStatus?: string | null;
}

interface StaffProps {
  detail: LogbookDetail | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

export const Staff = ({ detail }: StaffProps) => {
  return (
    <div className="sm:col-span-2 flex items-center gap-2">
      <span className="text-sm text-gray-500 w-24">
        Staff Pengajar
      </span>
      <span className="text-sm font-medium text-gray-800">
        {formatDisplayText(detail?.staffPengajar)}
      </span>
      <StatusBadge status={detail?.verifiedStatus ?? null} type="staff" />
    </div>
  );
};