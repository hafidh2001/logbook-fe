import { BarChart } from "@/components/chart/barChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import type { ChartData } from "chart.js";

interface LogbookByStatusItem {
  status: string;
  count: number;
}

interface LogbookByStatusChartProps {
  data: LogbookByStatusItem[] | null;
}

export const LogbookByStatusChart = ({ data }: LogbookByStatusChartProps) => {
  const chartData: ChartData<"bar", number[], string> = {
    labels: data?.map((item) => item.status) ?? [],
    datasets: [
      {
        data: data?.map((item) => item.count) ?? [],
        backgroundColor: ["#81C784", "#E57373", "#64B5F6", "#FFD54F"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <CardWrapper
      title="Jumlah Logbook dan Status"
      className="flex flex-col"
      contentClassName="flex-1 overflow-x-auto flex justify-center items-center"
    >
      <div className="min-w-full h-full">
        <BarChart
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
