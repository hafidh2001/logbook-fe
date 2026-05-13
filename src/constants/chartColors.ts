/**
 * Light blue-themed color palette for charts
 * Total: 20 colors
 */
export const CHART_COLORS = [
  // Light blues - from lighter to darker, vibrant range
  "#64B5F6", // Blue 300
  "#42A5F5", // Blue 400
  "#2196F3", // Blue 500
  "#1E88E5", // Blue 600
  "#1976D2", // Blue 700
  "#1565C0", // Blue 800
  "#0D47A1", // Blue 900
  "#82B1FF", // Blue A100
  "#80D8FF", // Blue A200
  "#448AFF", // Blue A400
  "#2979FF", // Blue A500
  "#82CFFF", // Light Blue 200
  "#4FC3F7", // Light Blue 300
  "#29B6F6", // Light Blue 400
  "#03A9F4", // Light Blue 500
  "#00BCD4", // Cyan 400
  "#00ACC1", // Cyan 500
  "#0097A7", // Cyan 700
  "#0277BD", // Light Blue 800
  "#01579B", // Light Blue 900
] as const;

export type ChartColor = (typeof CHART_COLORS)[number];
