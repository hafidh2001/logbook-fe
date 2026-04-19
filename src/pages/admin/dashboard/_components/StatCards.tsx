import { icons } from "@/assets/images/Icon";

interface StatCardsData {
  active_ppds_count: number;
  total_ppds: number;
  inactive_ppds_count: number;
  activity_count: number;
  staff_pengajar_count: number;
  stage_count: number;
  logbook_count: number;
  unverified_logbook_count: number;
}

interface StatCardsProps {
  data: StatCardsData;
}

export const StatCards = ({ data }: StatCardsProps) => {
  return (
    <div className="flex gap-4 min-w-max lg:min-w-full">
      {/* Active PPDS */}
      <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <icons.Users className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 justify-center">
          <span className="text-xl font-bold text-gray-800">
            {data.active_ppds_count}
          </span>
          <span className="text-xs text-gray-500">
            of {data.total_ppds}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Active PPDS</p>
        <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline truncate text-center">
          {data.inactive_ppds_count} Inactive PPDS
        </p>
      </div>

      {/* Activity */}
      <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <icons.NotebookPen className="h-5 w-5" />
          </div>
        </div>
        <span className="text-xl font-bold text-gray-800 block text-center">
          {data.activity_count}
        </span>
        <p className="text-xs text-gray-500 mt-1 text-center">Activity</p>
      </div>

      {/* Staff Pengajar */}
      <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <icons.Users className="h-5 w-5" />
          </div>
        </div>
        <span className="text-xl font-bold text-gray-800 block text-center">
          {data.staff_pengajar_count}
        </span>
        <p className="text-xs text-gray-500 mt-1 text-center">Staff Pengajar</p>
      </div>

      {/* Stage */}
      <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <icons.Pencil className="h-5 w-5" />
          </div>
        </div>
        <span className="text-xl font-bold text-gray-800 block text-center">
          {data.stage_count}
        </span>
        <p className="text-xs text-gray-500 mt-1 text-center">Stage</p>
      </div>

      {/* Logbook */}
      <div className="flex-shrink-0 w-44 lg:flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <icons.Book className="h-5 w-5" />
          </div>
        </div>
        <span className="text-xl font-bold text-gray-800 block text-center">
          {data.logbook_count}
        </span>
        <p className="text-xs text-gray-500 mt-1 text-center">Logbook</p>
        <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline truncate text-center">
          {data.unverified_logbook_count} Unverified
        </p>
      </div>
    </div>
  );
};
