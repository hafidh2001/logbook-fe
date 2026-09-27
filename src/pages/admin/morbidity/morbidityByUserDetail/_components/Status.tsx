import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "@/components/statusBadge";
import { TMorbidityByUserDetail } from "@/types/morbidity";

interface Props {
  data: TMorbidityByUserDetail | null;
}

const title = "Status Verifikasi";

export const Status = ({ data }: Props) => {
  if (data?.staff.length === 0) {
    return (
      <CardWrapper title={title} contentClassName="flex flex-col gap-3">
        <span className="text-sm text-gray-500">-</span>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title={title} contentClassName="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <span className="text-sm text-gray-500 text-nowrap">
            Status Logbook
          </span>
        </div>
        <StatusBadge status={data?.status.toLowerCase() ?? null} />
      </div>
      <br />
      {data?.staff.map(
        (
          item: {
            name: string | null;
            role: string | null;
            status: string | null;
          },
          index: number,
        ) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-800 block">
                {item.role ?? "-"}
              </span>
              <span className="text-sm text-gray-600">{item.name ?? "-"}</span>
            </div>
            <StatusBadge status={item.status ?? null} />
          </div>
        ),
      )}
    </CardWrapper>
  );
};
