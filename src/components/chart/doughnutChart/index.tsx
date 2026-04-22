import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type CoreChartOptions,
  type ElementChartOptions,
  type PluginChartOptions,
  type DatasetChartOptions,
  type ScaleChartOptions,
  type DoughnutControllerChartOptions,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import type { _DeepPartialObject } from "../../../../node_modules/chart.js/dist/types/utils";
import type { CSSProperties, FC } from "react";

ChartJS.register(ChartDataLabels, ArcElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "Plus Jakarta Sans";
ChartJS.defaults.color = "#000";
ChartJS.defaults.font.size = 14;

type Props = {
  data: ChartData<"doughnut", number[], string>;
  height?: number;
  width?: number;
  style?: CSSProperties | undefined;
  options?: _DeepPartialObject<
    | (CoreChartOptions<"doughnut"> &
        ElementChartOptions<"doughnut"> &
        PluginChartOptions<"doughnut"> &
        DatasetChartOptions<"doughnut"> &
        ScaleChartOptions<"doughnut"> &
        DoughnutControllerChartOptions)
    | undefined
  >;
  className?: string;
};

export const DoughnutChart: FC<Props> = ({
  data,
  width,
  height,
  style,
  options,
  className,
}) => {
  return (
    <>
      <Doughnut
        className={className}
        data={data}
        width={width}
        height={height}
        style={style}
        options={{
          ...options,
          responsive: true,
          maintainAspectRatio: true,
          color: "#000",
          font: {
            family: "Plus Jakarta Sans",
            size: 14,
          },
        }}
      />
    </>
  );
};
