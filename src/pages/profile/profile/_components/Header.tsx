import { icons } from "@/assets/images/Icon";
import { CardWrapper } from "@/components/card/cardWrapper";
import { Button } from "@/components/ui/button";
import type { TAuthUser } from "@/types/auth/login";

interface Props {
  data: TAuthUser;
  onEdit: () => void;
}

export const Header = ({ data, onEdit }: Props) => {
  return (
    <CardWrapper
      title="Profil"
      className="mb-4"
      contentClassName="sm:flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <icons.User className="h-11 w-11 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {data?.display_name ?? "-"}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            Role: {data?.role_name ?? "-"}
          </p>
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button
          variant="default"
          size="sm"
          onClick={onEdit}
          className="w-full sm:w-auto"
        >
          <icons.Pencil className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
      </div>
    </CardWrapper>
  );
};
