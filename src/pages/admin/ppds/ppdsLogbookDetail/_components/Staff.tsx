import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "@/components/statusBadge";
import type { TPpdsLogbookDetail } from "@/types/ppds";

interface Props {
  data: TPpdsLogbookDetail | null;
}

export const Staff = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Staff"
      contentClassName="sm:col-span-2 flex items-center gap-2"
    >
      <span className="text-sm text-gray-500 w-24">Staff Pengajar</span>
      <span className="text-sm font-medium text-gray-800">
        {data?.staff_name ?? "-"}
      </span>
      {/* <StatusBadge status={data?.verified_status ?? null} /> */}
    </CardWrapper>
  );
};
