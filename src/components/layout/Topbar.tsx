import { useState } from "react";
import { icons } from "@/assets/images/Icon";
import type { ITopbarProps } from "@/types/topbar";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/inputField";

export const Topbar = ({
  breadcrumbs,
  onSearch,
  onCreate,
  onExport,
  onSave,
  onDelete,
  searchPlaceholder = "Search...",
}: ITopbarProps) => {
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
          <form onSubmit={handleSearch} className="w-full">
            <InputField
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              startIcon={<icons.Search size={16} className="text-gray-400" />}
              containerClassName="mb-0"
            />
          </form>
        )}

        {/* Create */}
        {hasCreate && (
          <Button variant="default" onClick={onCreate}>
            <icons.Plus size={16} />
            <span className="hidden sm:inline">Create</span>
          </Button>
        )}

        {/* Export */}
        {hasExport && (
          <Button variant="secondary" onClick={onExport}>
            <icons.FileDown size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}

        {/* Save */}
        {hasSave && (
          <Button variant="default" onClick={onSave}>
            <icons.Save size={16} />
            <span className="inline">Save</span>
          </Button>
        )}

        {/* Delete */}
        {hasDelete && (
          <Button variant="destructive" onClick={onDelete}>
            <icons.Trash size={16} />
            <span className="inline">Delete</span>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-white border-b border-gray-100 lg:sticky lg:top-0 lg:left-auto lg:right-auto lg:z-30 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 px-4 lg:px-6 py-3">
        {/* Left side - Breadcrumbs (TOP on mobile, LEFT on desktop) */}
        <div className="order-1 lg:order-1 min-w-0 flex items-center min-h-[40px]">
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
