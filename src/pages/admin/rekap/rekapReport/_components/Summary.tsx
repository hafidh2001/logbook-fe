import { TRekapReportData } from "@/types/rekap";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

interface Props {
  data: TRekapReportData["summary"];
}

export const Summary = ({ data }: Props) => {
  const [searchParams] = useSearchParams();

  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");

  return (
    <div className="w-full sm:w-fit flex flex-col sm:flex-row gap-1">
      <div className="flex flex-row gap-1">
        <div className="w-1/2 sm:w-fit flex flex-col items-center gap-1 px-4 py-2 bg-[#087F5B] text-white rounded-md">
          <span className="font-semibold text-xs text-nowrap">Total PPDS</span>
          <span className="font-bold text-sm">{data?.total_ppds ?? 0}</span>
        </div>
        <div className="w-1/2 sm:w-fit flex flex-col items-center gap-1 px-4 py-2 bg-[#087F5B] text-white rounded-md">
          <span className="font-semibold text-xs text-nowrap">
            Total Logbooks
          </span>
          <span className="font-bold text-sm">{data?.total_logbooks ?? 0}</span>
        </div>
      </div>
      <div className="flex flex-row gap-1">
        <div className="w-1/2 sm:w-fit flex flex-col items-center gap-1 px-4 py-2 bg-[#087F5B] text-white rounded-md">
          <span className="font-semibold text-xs text-nowrap">
            Avg per PPDS
          </span>
          <span className="font-bold text-sm">{data?.avg_per_ppds ?? 0}</span>
        </div>
        <div className="w-1/2 sm:w-fit flex flex-col items-center gap-1 px-4 py-2 bg-[#087F5B] text-white rounded-md">
          <span className="font-semibold text-xs text-nowrap">Semester</span>
          <span className="font-bold text-sm">
            {data?.total_semesters ?? 0}
          </span>
        </div>
      </div>
      <div className="w-full sm:w-fit flex flex-col items-center gap-1 px-4 py-2 bg-[#087F5B] text-white rounded-md">
        <span className="font-semibold text-xs text-nowrap">Period</span>
        <span className="font-bold text-sm text-nowrap">
          {dayjs(start_date).locale("id").format("DD/MM/YYYY")} -{" "}
          {dayjs(end_date).locale("id").format("DD/MM/YYYY")}
        </span>
      </div>
    </div>
  );
};
