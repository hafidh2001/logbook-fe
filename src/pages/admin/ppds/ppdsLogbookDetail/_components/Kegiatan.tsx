import dayjs from "dayjs";
import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "@/components/statusBadge";
import type { TPpdsLogbookDetail } from "@/types/ppds";

interface Props {
  data: TPpdsLogbookDetail | null;
}

export const Kegiatan = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Kegiatan"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Date</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.date ? dayjs(data.date).format("DD MMM YYYY") : "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Catatan</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.notes ?? "-"}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Activity</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.action ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Verified Status</span>
        <StatusBadge status={data?.verified_status ?? null} />
      </div>
      {/* Row 3 - Hospital (full width) */}
      <div className="sm:col-span-2 flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Hospital</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.hospital ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
