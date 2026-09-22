import { icons } from "@/assets/images/Icon";
import { LogbookStatusEnum } from "@/types";

interface Props {
  status: string | null;
}

export const StatusBadge = ({ status }: Props) => {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
        -
      </span>
    );
  }

  switch (status) {
    case LogbookStatusEnum.APPROVED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
          <icons.Check className="h-3 w-3" />
          {LogbookStatusEnum.APPROVED}
        </span>
      );

    case LogbookStatusEnum.PENDING:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">
          <icons.Clock className="h-3 w-3" />
          {LogbookStatusEnum.PENDING}
        </span>
      );

    case LogbookStatusEnum.REJECTED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md">
          <icons.X className="h-3 w-3" />
          {LogbookStatusEnum.REJECTED}
        </span>
      );

    case LogbookStatusEnum.REVISED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
          <icons.RotateCcw className="h-3 w-3" />
          {LogbookStatusEnum.REVISED}
        </span>
      );

    case LogbookStatusEnum.VERIFIED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
          <icons.Check className="h-3 w-3" />
          {LogbookStatusEnum.VERIFIED}
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
          {status}
        </span>
      );
  }
};
