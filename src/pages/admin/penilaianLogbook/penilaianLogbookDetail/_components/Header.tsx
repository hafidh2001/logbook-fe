import { icons } from "@/assets/images/Icon";
import { TPenilaianLogbookDetailByStatus } from "@/types/penilaianLogbook";

interface Props {
  data: TPenilaianLogbookDetailByStatus | null;
}

export const Header = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF6EF] flex items-center justify-center">
            <icons.User className="h-9 w-9 text-[#087F5B]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {data?.ppds_name ?? "-"}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">{data?.code ?? "-"}</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                {data?.semester_name ?? "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
