import { useState } from "react";
import { icons } from "@/assets/images/Icon";
import type { TopbarProps } from "@/types/topbar";

export const Topbar = ({
  breadcrumbs,
  variant = 5,
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

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 lg:px-6 h-14 flex items-center">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left side - Breadcrumbs */}
        <div className="flex-1 min-w-0">
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

        {/* Right side - Variants */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Variant 1: Search + Create + Export */}
          {variant === 1 && (
            <>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-40 lg:w-56 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-9 !outline-none"
                />
                <icons.Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </form>
              {onCreate && (
                <button
                  onClick={onCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors h-9"
                >
                  <icons.Plus size={16} />
                  <span className="hidden sm:inline">Create</span>
                </button>
              )}
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors h-9"
                >
                  <icons.FileDown size={16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
            </>
          )}

          {/* Variant 2: Save + Delete */}
          {variant === 2 && (
            <>
              {onSave && (
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors h-9"
                >
                  <icons.Save size={16} />
                  <span className="hidden sm:inline">Save</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors h-9"
                >
                  <icons.Trash size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
            </>
          )}

          {/* Variant 3: Search + Export */}
          {variant === 3 && (
            <>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-40 lg:w-56 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-9 !outline-none"
                />
                <icons.Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </form>
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors h-9"
                >
                  <icons.FileDown size={16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
            </>
          )}

          {/* Variant 4: Search only */}
          {variant === 4 && (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                className="w-40 lg:w-56 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-9 !outline-none"
              />
              <icons.Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </form>
          )}

          {/* Variant 5: Nothing */}

          {/* Variant 6: Save only */}
          {variant === 6 && onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors h-9"
            >
              <icons.Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
