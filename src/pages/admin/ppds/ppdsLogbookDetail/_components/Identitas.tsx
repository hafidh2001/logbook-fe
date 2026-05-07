import { CardWrapper } from "@/components/card/cardWrapper";
import { TPpdsLogbookDetail } from "@/types/ppds";

interface Props {
  data: TPpdsLogbookDetail | null;
}

export const Identitas = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Identitas"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">PPDS</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.ppds_name ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.nim ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Inisial Code</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.inisial_code ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
