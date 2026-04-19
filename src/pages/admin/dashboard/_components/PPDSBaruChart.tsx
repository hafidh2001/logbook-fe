import { LineChart } from "@/components/chart/lineChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import type { ChartData } from "chart.js";

interface PPDSBaruChartItem {
  year: string;
  count: number;
}

interface PPDSBaruChartProps {
  data: PPDSBaruChartItem[];
}

export const PPDSBaruChart = ({ data }: PPDSBaruChartProps) => {
  const chartData: ChartData<"line", number[], string> = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        data: data.map((item) => item.count),
        borderColor: "#14B8A6",
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#14B8A6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <CardWrapper
      title="Jumlah PPDS Baru"
      className="flex flex-col"
      contentClassName="flex-1 overflow-x-auto flex justify-center items-center"
    >
      <div className="min-w-full h-full">
        <LineChart
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </CardWrapper>
  );
};
