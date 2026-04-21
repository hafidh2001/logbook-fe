export type TBreadcrumb = {
  label: string;
  to?: string;
};

export interface ITopbarProps {
  breadcrumbs: TBreadcrumb[];
  onSearch?: (query: string) => void;
  onCreate?: () => void;
  onExport?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
}
