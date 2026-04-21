import { CardWrapper } from "@/components/card/cardWrapper";
import type { TAuthUser } from "@/types/auth/login";

interface Props {
  data: TAuthUser;
}

export const InfoDetail = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Info Detail"
      className="mb-4"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Nama</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.display_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Email</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.email || "-"}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Telephone Number</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.phone || "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.code || "-"}
        </span>
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Tanggal Lahir</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.date_of_birth || "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-36">Address</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.address || "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
