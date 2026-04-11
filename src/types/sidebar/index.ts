export type NavItem = {
  label: string;
  icon: React.ReactNode;
  to?: string;
  children?: { label: string; to: string }[];
};
