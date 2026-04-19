interface Participant {
  displayName?: string;
  code?: string | null;
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
        <span className="text-sm text-gray-500 w-24">Nama</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(participant?.displayName)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-24">Code</span>
        <span className="text-sm font-medium text-gray-800">
          {formatDisplayText(participant?.code)}
        </span>
      </div>
    </div>
  );
};