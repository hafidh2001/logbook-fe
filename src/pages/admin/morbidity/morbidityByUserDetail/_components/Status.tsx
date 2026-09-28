import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "@/components/statusBadge";
import { TMorbidityByUserDetail } from "@/types/morbidity";
import { Fragment } from "react/jsx-runtime";

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
      <hr />
      <br />
      {data?.staff.map((item, index: number) => (
        <Fragment key={index}>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-800 block">
                {item.role ?? "-"}
              </span>
              <span className="text-sm text-gray-600 block">
                {item.name ?? "-"}
              </span>
              <div className="flex flex-row items-center">
                <span className="text-sm text-gray-600">
                  Catatan Verifikasi :{" "}
                </span>
                <span className="text-sm text-gray-600">
                  {item.verify_notes ?? " -"}
                </span>
              </div>
            </div>
            <StatusBadge status={item.status ?? null} />
          </div>
          {index !== data?.staff.length - 1 && <hr />}
        </Fragment>
      ))}
    </CardWrapper>
  );
};
