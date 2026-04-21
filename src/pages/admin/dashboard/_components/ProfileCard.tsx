import { DashboardIcon } from "@/assets/images/DashboardIcon";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";

export const ProfileCard = () => {
  const { user } = useAuthStore();
  const year = dayjs().year();

  return (
    <div className="p-6 flex items-center gap-6">
      <div className="flex-shrink-0">
        <DashboardIcon className="w-24 h-24" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {user?.client_name ?? "-"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tahun Ajaran {year-1}/{year}
        </p>
      </div>
    </div>
  );
};
