import { CardWrapper } from "@/components/card/cardWrapper";

interface Props {
  data: any[];
}

export const ActivityBreakdown = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Activity Breakdown"
      contentClassName="flex flex-col sm:flex-row gap-4"
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-lg">
            {item.count}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {item.label}
          </span>
        </div>
      ))}
    </CardWrapper>
  );
};
