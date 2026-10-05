import { CardWrapper } from "@/components/card/cardWrapper";
import { TRekapReportDetailData } from "@/types/rekap";

interface Props {
  data: TRekapReportDetailData["activity"];
}

export const ActivityBreakdown = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Activity Breakdown"
      contentClassName="flex flex-col sm:flex-row gap-4 sm:overflow-x-scroll scrollbar-visible"
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="shrink-0 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 sm:!w-[250px]"
        >
          <div className="!w-14 !h-14 flex items-center justify-center bg-[#EAF6EF] text-[#087F5B] font-bold rounded-lg">
            {item.jumlah}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {item.aktivitas}
          </span>
        </div>
      ))}
    </CardWrapper>
  );
};
