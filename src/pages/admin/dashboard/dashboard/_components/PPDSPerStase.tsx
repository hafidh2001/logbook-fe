import { PieChart } from "@/components/chart/pieChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import { useDashboardStore } from "@/store/dashboardStore";
import type { ChartData } from "chart.js";

export const PPDSPerStase = () => {
  const { ppdsPerStase } = useDashboardStore();

  const chartData: ChartData<"pie", number[], string> = {
    labels: ppdsPerStase.map((item) => item.stase) ?? [],
    datasets: [
      {
        data: ppdsPerStase.map((item) => item.count) ?? [],
        backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <CardWrapper title="PPDS Per Stase">
      <div className="h-72 flex items-center justify-center">
        <div className="w-full sm:w-[270px]">
          <PieChart
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>
    </CardWrapper>
  );
};