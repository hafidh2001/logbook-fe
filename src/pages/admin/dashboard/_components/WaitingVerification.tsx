import { icons } from "@/assets/images/Icon";
import { CardWrapper } from "@/components/card/cardWrapper";

interface WaitingVerificationItem {
  activity: string;
  staff: string;
  date: string;
}

interface WaitingVerificationProps {
  items: WaitingVerificationItem[];
}

export const WaitingVerification = ({ items }: WaitingVerificationProps) => {
  return (
    <CardWrapper title="Menunggu Verifikasi">
      <div className="max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.activity}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <icons.User className="h-3 w-3" />
                    {item.staff}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <icons.Calendar className="h-3 w-3" />
                    {item.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
};
