import { CardWrapper } from "@/components/card/cardWrapper";
import { StatusBadge } from "./StatusBadge";

interface Props {
  data: any;
}

export const Staff = ({ data }: Props) => {
  return (
    <CardWrapper title="Staff" contentClassName="flex flex-col gap-3">
      {data?.staff?.map((item: any) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-sm font-semibold text-gray-800 block">
              {item.role}
            </span>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
          <StatusBadge status={item.status} />
        </div>
      ))}
    </CardWrapper>
  );
};
