import { StatusBadge } from "./StatusBadge";

interface StaffItem {
  id: number;
  role: string;
  name: string;
  status: "pending" | "verified";
}

interface PenilaianLogbookDetail {
  staff?: StaffItem[];
}

interface StaffProps {
  data: PenilaianLogbookDetail | null;
}

export const Staff = ({ data }: StaffProps) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-gray-200 bg-slate-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Staff
        </h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-3">
          {data?.staff?.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-800 block">
                  {item.role}
                </span>
                <span className="text-sm text-gray-600">
                  {item.name}
                </span>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};