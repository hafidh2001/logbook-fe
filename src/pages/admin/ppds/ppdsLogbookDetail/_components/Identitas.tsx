interface Participant {
  displayName?: string;
  nim?: string | null;
}

interface IdentitasProps {
  participant: Participant | null;
}

const formatDisplayText = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

export const Identitas = ({ participant }: IdentitasProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">PPDS</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(participant?.displayName)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">
          Inisial Code
        </span>
        <span className="text-sm font-medium text-gray-800">
          -
        </span>
      </div>
      {/* Row 2 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">NIM</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(participant?.nim)}
        </span>
      </div>
      <div></div>
    </div>
  );
};