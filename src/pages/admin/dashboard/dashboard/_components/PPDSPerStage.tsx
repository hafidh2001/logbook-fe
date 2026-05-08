import { DoughnutChart } from "@/components/chart/doughnutChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import { useDashboardStore } from "@/store/dashboardStore";
import type { ChartData } from "chart.js";

export const PPDSPerStage = () => {
  const { ppdsPerStage } = useDashboardStore();

  const chartData: ChartData<"doughnut", number[], string> = {
    labels: ppdsPerStage.map((item) => item.stage) ?? [],
    datasets: [
      {
        data: ppdsPerStage.map((item) => item.count) ?? [],
        backgroundColor: ["#6C63FF", "#81C784", "#64B5F6"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <CardWrapper title="PPDS Per Stage">
      <div className="h-72 flex items-center justify-center">
        <div className="w-full sm:w-[270px]">
          <DoughnutChart
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