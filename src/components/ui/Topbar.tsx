import { useState } from "react";
import { icons } from "@/assets/images/Icon";
import type { TopbarProps } from "@/types/topbar";

export const Topbar = ({
  breadcrumbs,
  onSearch,
  onCreate,
  onExport,
  onSave,
  onDelete,
  searchPlaceholder = "Search...",
}: TopbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(searchQuery);
    }
  };

  const hasSearch = !!onSearch;
  const hasCreate = !!onCreate;
  const hasExport = !!onExport;
  const hasSave = !!onSave;
  const hasDelete = !!onDelete;

  const renderActions = () => {
    if (!hasSearch && !hasCreate && !hasExport && !hasSave && !hasDelete) {
      return null;
    }

    return (
      <div className="flex items-center justify-end lg:justify-end gap-2 flex-shrink-0 order-2 lg:order-2">
        {/* Search */}
        {hasSearch && (
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              className="w-full lg:w-56 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-9 !outline-none"
            />
            <icons.Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </form>
        )}

        {/* Create */}
        {hasCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors h-9"
          >
            <icons.Plus size={16} />
            <span className="hidden sm:inline">Create</span>
          </button>
        )}

        {/* Export */}
        {hasExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors h-9"
          >
            <icons.FileDown size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}

        {/* Save */}
        {hasSave && (
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors h-9"
          >
            <icons.Save size={16} />
            <span className="inline">Save</span>
          </button>
        )}

        {/* Delete */}
        {hasDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors h-9"
          >
            <icons.Trash size={16} />
            <span className="inline">Delete</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 px-4 lg:px-6 py-3">
        {/* Left side - Breadcrumbs (TOP on mobile, LEFT on desktop) */}
        <div className="order-1 lg:order-1 min-w-0">
          <nav className="flex items-center gap-2 text-sm overflow-x-auto">
            {breadcrumbs.length === 0 ? (
              <span className="text-gray-400">-</span>
            ) : (
              breadcrumbs.map((crumb, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {index > 0 && (
                    <icons.ChevronRight
                      size={14}
                      className="text-gray-400 flex-shrink-0"
                    />
                  )}
                  {crumb.to ? (
                    <a
                      href={crumb.to}
                      className="text-gray-800 font-medium transition-colors no-underline"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-800 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))
            )}
          </nav>
        </div>

        {/* Right side - Actions */}
        {renderActions()}
      </div>
    </div>
  );
};
