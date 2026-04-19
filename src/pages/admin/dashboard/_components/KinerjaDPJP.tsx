import { icons } from "@/assets/images/Icon";
import { CardWrapper } from "@/components/card/cardWrapper";

interface KinerjaDPJPItem {
  name: string;
  total_logbook: number;
  pending: number;
  verified: number;
}

interface KinerjaDPJPProps {
  items: KinerjaDPJPItem[] | null;
}

export const KinerjaDPJP = ({ items }: KinerjaDPJPProps) => {
  return (
    <CardWrapper title="Kinerja DPJP">
      <div className="max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                  <icons.User className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <icons.NotebookPen className="h-3 w-3" />
                  {item.total_logbook}
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  <icons.Clock className="h-3 w-3" />
                  {item.pending}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <icons.Check className="h-3 w-3" />
                  {item.verified}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
};
