import { icons } from "@/assets/images/Icon";
import { CardWrapper } from "@/components/card/cardWrapper";

interface LogActivityItem {
  message: string;
}

interface LogActivityProps {
  items: LogActivityItem[] | null;
}

export const LogActivity = ({ items }: LogActivityProps) => {
  return (
    <CardWrapper title="Log Aktivitas">
      <div className="max-h-72 overflow-y-auto">
        <div className="space-y-3">
          {items?.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                <icons.Calendar className="h-4 w-4" />
              </div>
              <p className="text-sm text-gray-700">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
};
