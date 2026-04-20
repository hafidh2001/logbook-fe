import { icons } from "@/assets/images/Icon";

interface Props {
  status: string | null;
  type?: "verified" | "ppds";
}

export const StatusBadge = ({ status, type = "verified" }: Props) => {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
        -
      </span>
    );
  }

  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
        <icons.Check className="h-3 w-3" />
        Terverifikasi
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
        <icons.Clock className="h-3 w-3" />
        {type === "ppds" ? "Pending" : "Menunggu"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
      {status}
    </span>
  );
};
