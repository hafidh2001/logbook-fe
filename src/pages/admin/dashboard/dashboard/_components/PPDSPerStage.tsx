import { DoughnutChart } from "@/components/chart/doughnutChart";
import { CardWrapper } from "@/components/card/cardWrapper";
import { useDashboardStore } from "@/store/dashboardStore";
import { CHART_COLORS } from "@/constants/chartColors";
import { useRef, useState, useEffect } from "react";
import type { ChartData } from "chart.js";

export const PPDSPerStage = () => {
  const { ppdsPerStage } = useDashboardStore();
  const legendRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  const [hiddenItems, setHiddenItems] = useState<Set<number>>(new Set());
  const [chartSize, setChartSize] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (legendRef.current) {
        setChartSize(legendRef.current.offsetHeight);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (legendRef.current) {
      resizeObserver.observe(legendRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const chartData: ChartData<"doughnut", number[], string> = {
    labels: ppdsPerStage.map((item) => item.stage) ?? [],
    datasets: [
      {
        data: ppdsPerStage.map((item) => item.count) ?? [],
        backgroundColor: ppdsPerStage.map(
          (_, index) => CHART_COLORS[index % CHART_COLORS.length]
        ),
        borderWidth: 0,
      },
    ],
  };

  const handleLegendClick = (index: number) => {
    chartRef.current?.toggleDataVisibility(index);
    setHiddenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <CardWrapper title="PPDS Per Stage">
      <div className="h-72 flex gap-4">
        {/* Left: Square Chart Area */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: chartSize, height: chartSize }}
        >
          <DoughnutChart
            ref={chartRef}
            data={chartData}
            options={{
              responsive: false,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
            width={chartSize}
            height={chartSize}
          />
        </div>

        {/* Right: Legend Area (scrollable) */}
        <div
          ref={legendRef}
          className="flex-1 min-w-0 overflow-y-auto flex items-center"
        >
          <div className="space-y-2 flex-1">
            {ppdsPerStage.map((item, index) => (
              <button
                key={item.stage}
                onClick={() => handleLegendClick(index)}
                className="flex items-center gap-2 w-full text-left hover:opacity-70 transition-opacity"
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span
                  className={`text-sm truncate ${
                    hiddenItems.has(index)
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {item.stage}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
