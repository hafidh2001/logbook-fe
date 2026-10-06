import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "@/components/statusBadge";
import dayjs from "dayjs";

interface Props {
  data: any;
}

export const Kegiatan = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Kegiatan"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Date</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.date
            ? dayjs(data.date).locale("id").format("DD MMM YYYY - HH:mm")
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Catatan</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.attachment ?? "-"}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Activity</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.action ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Status</span>
        <StatusBadge status={data?.status ?? null} />
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Kategori</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.category ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Patient</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.patient ?? "-"}
        </span>
      </div>
      {/* Row 4 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Peran</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.peran ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Diagnosis</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.diagnosis ?? "-"}
        </span>
      </div>
      {/* Row 5 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Judul</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.title ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Treatment</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.treatment ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
