import { CardWrapper } from "@/components/card/cardWrapper";
import { TPenilaianLogbookDetailByStatus } from "@/types/penilaianLogbook";
import dayjs from "dayjs";

interface Props {
  data: TPenilaianLogbookDetailByStatus | null;
}

export const Kegiatan = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Kegiatan"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Date</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.date
            ? dayjs(data.date).locale("id").format("DD MMM YYYY - HH:mm")
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Peran</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.role_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Activity</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.action_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Judul</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.title ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Stase</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.stase_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Pin</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.stage_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Category</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.category ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Catatan</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.notes ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
