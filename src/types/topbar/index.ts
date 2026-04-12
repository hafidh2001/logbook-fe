export type Breadcrumb = {
  label: string;
  to?: string;
};

export interface TopbarProps {
  breadcrumbs: Breadcrumb[];
  onSearch?: (query: string) => void;
  onCreate?: () => void;
  onExport?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  searchPlaceholder?: string;
}
