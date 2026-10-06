import { CardWrapper } from "@/components/card/cardWrapper";
import { TMorbidityByUserDetail } from "@/types/morbidity";
import dayjs from "dayjs";

interface Props {
  data: TMorbidityByUserDetail | null;
}

export const Detail = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Detail"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">PX Name</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.patient_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Age</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.umur ?? "-"}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">CM</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.cm ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Dx Awal</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.dx_awal ?? "-"}
        </span>
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
        <span className="text-sm text-gray-500 w-24">Kronologi Morbiditas</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.kronologi_morbiditas ?? "-"}
        </span>
      </div>
      {/* Row 4 */}

      {/* Row 5 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Date Morbidity</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.date
            ? dayjs(data?.date).locale("id").format("DD MMMM YYYY")
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Staff Pelapor</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.staff_pelapor ?? "-"}
        </span>
      </div>
      {/* Row 6 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Staff Penilai / GKM</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.staff_penilai ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Staff KPS</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.staff_kps ?? "-"}
        </span>
      </div>
      {/* Row 7 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Category</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.category ?? "-"}
        </span>
      </div>

      {data?.lampiran ? (
        <div className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm text-gray-500 w-24">
            Lampiran (Opsional)
          </span>
          <div className="flex flex-col w-1/2 gap-2">
            <img
              src={
                import.meta.env.VITE_API_URL.split("/index.php")[0] +
                "/_file" +
                data?.lampiran.split("_file")[1]
              }
              alt="img"
              className="w-full h-auto"
              onClick={() =>
                window.open(
                  import.meta.env.VITE_API_URL.split("/index.php")[0] +
                    "/" +
                    data?.lampiran,
                  "_blank", // <- This is what makes it open in a new window.
                )
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <span className="text-sm text-gray-500 w-24">
            Lampiran (Opsional)
          </span>
          <span className="text-sm font-medium text-gray-800">
            {data?.lampiran ?? "-"}
          </span>
        </div>
      )}
      <div></div>
    </CardWrapper>
  );
};
