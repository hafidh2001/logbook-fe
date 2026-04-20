import { CardWrapper } from "@/components/card/cardWrapper";

interface Props {
  data: any;
}

export const Identitas = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Identitas"
      className="mb-4"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Nama</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.displayName ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.code ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
