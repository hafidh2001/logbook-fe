import { DashboardIcon } from "@/assets/images/DashboardIcon";

interface ProfileCardProps {
  teamName: string;
  year: string;
}

export const ProfileCard = ({ teamName, year }: ProfileCardProps) => {
  return (
    <div className="p-6 flex items-center gap-6">
      <div className="flex-shrink-0">
        <DashboardIcon className="w-24 h-24" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {teamName}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tahun Ajaran {year}
        </p>
      </div>
    </div>
  );
};
