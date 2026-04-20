import { CardWrapper } from "@/components/card/cardWrapper";

interface Props {
  data: any;
}

export const Summary = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Summary"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Period</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.card_summary?.period ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Total Logbooks</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.card_summary?.total_logbooks ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Semester</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.card_summary?.semester ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Status</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.card_summary?.status ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
