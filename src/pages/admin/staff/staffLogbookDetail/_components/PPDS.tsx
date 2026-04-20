import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "@/components/statusBadge";

interface Props {
  data: any;
}

export const PPDS = ({ data }: Props) => {
  return (
    <CardWrapper
      title="PPDS"
      className="mb-4"
      contentClassName="sm:col-span-2 flex items-center gap-2"
    >
      <span className="text-sm text-gray-500 w-24">PPDS</span>
      <span className="text-sm font-medium text-gray-800">
        {data?.ppds ?? "-"}
      </span>
      <StatusBadge status={data?.verifiedStatus ?? null} />
    </CardWrapper>
  );
};
