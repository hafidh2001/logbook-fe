interface ActivityItem {
  count: number;
  label: string;
}

interface ActivityBreakdownProps {
  items: ActivityItem[];
}

export const ActivityBreakdown = ({ items }: ActivityBreakdownProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-lg">
            {item.count}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};