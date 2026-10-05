import { icons } from "@/assets/images/Icon";
import { CardWrapper } from "@/components/card/cardWrapper";
import { useDashboardStore } from "@/store/dashboardStore";

export const KinerjaPPDS = () => {
  const { kinerjaPPDS, isLoading } = useDashboardStore();

  if (isLoading) {
    return (
      <CardWrapper title="Kinerja PPDS">
        <div className="flex items-center justify-center h-40">
          <span className="text-gray-400">Memuat...</span>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title="Kinerja PPDS">
      <div className="max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {kinerjaPPDS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAF6EF] text-[#087F5B] flex items-center justify-center">
                  <icons.User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.stase}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#087F5B]">
                <icons.Check className="h-3 w-3" />
                {item.verified_count}
              </div>
            </div>
          ))}
          {kinerjaPPDS.length === 0 && (
            <div className="flex items-center justify-center h-20">
              <span className="text-gray-400">Tidak ada data</span>
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};