import { DoughnutChart } from "@/components/chart/doughnutChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import type { ChartData } from "chart.js";

interface PPDSPerStaseItem {
  stase: string;
  count: number;
}

interface PPDSPerStaseProps {
  data: PPDSPerStaseItem[];
}

export const PPDSPerStase = ({ data }: PPDSPerStaseProps) => {
  const chartData: ChartData<"doughnut", number[], string> = {
    labels: data.map((item) => item.stase),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <CardWrapper title="PPDS Per Stase">
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
