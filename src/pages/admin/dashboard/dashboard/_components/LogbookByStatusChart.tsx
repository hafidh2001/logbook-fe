import { BarChart } from "@/components/chart/barChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import { useDashboardStore } from "@/store/dashboardStore";
import type { ChartData } from "chart.js";

export const LogbookByStatusChart = () => {
  const { logbookByStatus } = useDashboardStore();

  const chartData: ChartData<"bar", number[], string> = {
    labels: logbookByStatus.map((item) => item.status),
    datasets: [
      {
        data: logbookByStatus.map((item) => item.count),
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
