import { LineChart } from "@/components/chart/lineChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import { useDashboardStore } from "@/store/dashboardStore";
import { CHART_COLORS } from "@/constants/chartColors";
import type { ChartData } from "chart.js";

export const PPDSBaruChart = () => {
  const { ppdsBaru } = useDashboardStore();

  const lineColor = CHART_COLORS[0]; // Use first color from palette

  // Convert hex to rgba for fill
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const chartData: ChartData<"line", number[], string> = {
    labels: ppdsBaru.map((item) => item.year) ?? [],
    datasets: [
      {
        data: ppdsBaru.map((item) => item.count) ?? [],
        borderColor: lineColor,
        backgroundColor: hexToRgba(lineColor, 0.15), // 15% opacity
        fill: true,
        tension: 0.4,
        pointBackgroundColor: lineColor,
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
                ticks: {
                  callback: function (value) {
                    if (Number.isInteger(value)) {
                      return value;
                    }
                    return "";
                  },
                },
              },
            },
          }}
        />
      </div>
    </CardWrapper>
  );
};