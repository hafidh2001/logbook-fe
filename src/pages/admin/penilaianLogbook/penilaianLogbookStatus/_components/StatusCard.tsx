import { icons } from "@/assets/images/Icon";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  badgeIcon: LucideIcon;
  color: "green" | "yellow";
  value: number;
  title: string;
  onClick: () => void;
}

const colorClasses = {
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    badgeBg: "bg-green-600",
    badgeText: "text-white",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    badgeBg: "bg-yellow-600",
    badgeText: "text-white",
  },
};

export const StatusCard = ({
  icon: Icon,
  badgeIcon: BadgeIcon,
  color,
  value,
  title,
  onClick,
}: StatusCardProps) => {
  const colors = colorClasses[color];
  const IconComponent = Icon;
  const BadgeIconComponent = BadgeIcon;

  return (
    <div
      className="bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center`}>
            <IconComponent className={`h-7 w-7 ${colors.text}`} />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${colors.badgeBg} flex items-center justify-center`}>
            <BadgeIconComponent className={`h-4 w-4 ${colors.badgeText}`} />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">
            {value}
          </p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};