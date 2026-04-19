import dayjs from "dayjs";
import "dayjs/locale/id";
import { StatusBadge } from "./StatusBadge";

interface LogbookDetail {
  date?: string;
  notes?: string | null;
  activity?: string;
  verifiedStatus?: string | null;
  hospital?: string | null;
  ppds?: string | null;
}

interface KegiatanProps {
  detail: LogbookDetail | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("DD MMM YYYY – HH:mm");
};

export const Kegiatan = ({ detail }: KegiatanProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Date</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDate(detail?.date)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Catatan</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(detail?.notes)}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Activity</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(detail?.activity)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">
          Verified Status
        </span>
        <StatusBadge
          status={detail?.verifiedStatus ?? null}
          type="verified"
        />
      </div>
      {/* Row 3 - Hospital (full width) */}
      <div className="sm:col-span-2 flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Hospital</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(detail?.hospital)}
        </span>
      </div>
    </div>
  );
};