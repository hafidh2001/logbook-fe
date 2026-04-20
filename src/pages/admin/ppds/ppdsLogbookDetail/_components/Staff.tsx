import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "./StatusBadge";

interface Props {
  data: any;
}

export const Staff = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Staff"
      className="sm:col-span-2 flex items-center gap-2"
    >
      <span className="text-sm text-gray-500 w-24">Staff Pengajar</span>
      <span className="text-sm font-medium text-gray-800">
        {data?.staffPengajar ?? "-"}
      </span>
      <StatusBadge status={data?.verifiedStatus ?? null} type="staff" />
    </CardWrapper>
  );
};
