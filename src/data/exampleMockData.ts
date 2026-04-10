export type ExampleRow = {
  id: string;
  name: string;
  status: string;
  value: number;
  description: string;
};

export const sampleTableData: ExampleRow[] = [
  { id: "1", name: "Truck A", status: "Waiting", value: 12, description: "Load pending" },
  { id: "2", name: "Truck B", status: "In Progress", value: 8, description: "Loading" },
  { id: "3", name: "Truck C", status: "Completed", value: 20, description: "Ready to depart" },
];

export const sampleSpanData: ExampleRow[] = [
  { id: "A1", name: "Batch 1", status: "Ready", value: 30, description: "Alpha" },
  { id: "B2", name: "Batch 2", status: "Hold", value: 18, description: "Beta" },
  { id: "C3", name: "Batch 3", status: "Done", value: 24, description: "Gamma" },
];

export const barChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Delivery Volume",
      data: [12, 18, 9, 14, 20],
      backgroundColor: "rgba(59, 130, 246, 0.7)",
      borderColor: "rgba(37, 99, 235, 1)",
      borderWidth: 1,
    },
  ],
};

export const lineChartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Queue Length",
      data: [8, 10, 7, 12],
      borderColor: "rgba(16, 185, 129, 1)",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

export const doughnutChartData = {
  labels: ["Waiting", "Loading", "Completed"],
  datasets: [
    {
      label: "Status Distribution",
      data: [40, 35, 25],
      backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
      borderWidth: 1,
    },
  ],
};

export const tableColumns: Array<keyof ExampleRow | { name: keyof ExampleRow; header: string }> = [
  "name",
  {
    name: "status",
    header: "Status",
  },
  {
    name: "value",
    header: "Load",
  },
];

export const spanColumns = [
  { accessorKey: "id", header: "ID", size: 80 },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "details",
    header: "Details",
    columns: [
      { accessorKey: "status", header: "Status" },
      { accessorKey: "value", header: "Value" },
    ],
  },
];
