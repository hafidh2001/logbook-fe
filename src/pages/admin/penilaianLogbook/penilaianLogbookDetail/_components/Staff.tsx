import { CardWrapper } from "@/components/card/cardWrapper";
import { TPenilaianLogbookDetailByStatus } from "@/types/penilaianLogbook";

interface Props {
  data: TPenilaianLogbookDetailByStatus;
}

export const Staff = ({ data }: Props) => {
  if (data?.staff.length === 0) {
    return (
      <CardWrapper title="Staff" contentClassName="flex flex-col gap-3">
        <span className="text-sm text-gray-500">-</span>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title="Staff" contentClassName="flex flex-col gap-3">
      {data?.staff.map(
        (item: { name: string | null; role: string | null }, index: number) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-800 block">
                {item.role ?? "-"}
              </span>
              <span className="text-sm text-gray-600">{item.name ?? "-"}</span>
            </div>
          </div>
        ),
      )}
    </CardWrapper>
  );
};
