import { icons } from "@/assets/images/Icon";
import { Button } from "@/components/ui/button";

interface Profile {
  displayName?: string;
  role?: string;
}

interface HeaderProps {
  profile: Profile | null;
  onEdit: () => void;
}

export const Header = ({ profile, onEdit }: HeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <icons.User className="h-11 w-11 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {profile?.displayName || "-"}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            Role: {profile?.role || "-"}
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
    </div>
  );
};