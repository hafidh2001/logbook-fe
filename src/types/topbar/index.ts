export type Breadcrumb = {
  label: string;
  to?: string;
};

export type TopbarVariant = 1 | 2 | 3 | 4 | 5 | 6;

export interface TopbarProps {
  breadcrumbs: Breadcrumb[];
  variant?: TopbarVariant;
  onSearch?: (query: string) => void;
  onCreate?: () => void;
  onExport?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  searchPlaceholder?: string;
}
