import { CardWrapper } from "@/components/card/cardWrapper";

interface PenilaianLogbookDetail {
  ppds?: string | null;
  semester?: string | null;
  code?: string | null;
}

interface IdentitasProps {
  data: PenilaianLogbookDetail | null;
}

export const Identitas = ({ data }: IdentitasProps) => {
  return (
    <CardWrapper
      title="Identitas"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">PPDS</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.ppds ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Semester</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.semester ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.code ?? "-"}
        </span>
      </div>
      <div></div>
    </CardWrapper>
  );
};
