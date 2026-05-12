import { CardWrapper } from "@/components/card/cardWrapper";

interface Props {
  data: any;
}

export const Staff = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Staff"
      contentClassName="sm:col-span-2 flex items-center gap-2"
    >
      <span className="text-sm text-gray-500 w-24">Staff Pengajar</span>
      <span className="text-sm font-medium text-gray-800">
        {data?.staff ?? "-"}
      </span>
    </CardWrapper>
  );
};
