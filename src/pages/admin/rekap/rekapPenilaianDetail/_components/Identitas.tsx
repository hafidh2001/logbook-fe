import { CardWrapper } from "@/components/card/cardWrapper";

interface Props {
  data: any;
}

export const Identitas = ({ data }: Props) => {
  return (
    <CardWrapper
      title="Identitas"
      contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Date Logbook</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.date_logbook ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">PPDS</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.ppds ?? "-"}
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">NIM</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.nim ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Inisial Code</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.inisial_code ?? "-"}
        </span>
      </div>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Semester</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.semester ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Stase</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.stage ?? "-"}
        </span>
      </div>
      {/* Row 4 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">PIN</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.pin ?? "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-28">Staff</span>
        <span className="text-sm font-medium text-gray-800">
          {data?.staff ?? "-"}
        </span>
      </div>
    </CardWrapper>
  );
};
