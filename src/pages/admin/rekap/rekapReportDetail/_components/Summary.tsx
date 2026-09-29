import { CardWrapper } from "@/components/card/cardWrapper";
import { TRekapReportDetailData } from "@/types/rekap";
import dayjs from "dayjs";
interface Props {
  data: TRekapReportDetailData["summary"];
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
          {dayjs(data?.periode_mulai).locale("id").format("DD/MM/YYYY")} -{" "}
          {dayjs(data?.periode_selesai).locale("id").format("DD/MM/YYYY")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Total Logbooks</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.total_logbooks ?? "0"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Semester</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.semester ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Status</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.status ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
