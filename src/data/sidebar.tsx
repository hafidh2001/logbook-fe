import { icons } from "@/assets/images/Icon";
import { ROUTES } from "@/utils/routes";
import type { TNavItem } from "@/types/sidebar";

export const navItems: TNavItem[] = [
  { label: "Dashboard", icon: <icons.LayoutDashboard size={18} />, to: ROUTES.dashboard },
  { label: "PPDS", icon: <icons.User size={18} />, to: ROUTES.ppds },
  { label: "PPDS Inactive", icon: <icons.UserX size={18} />, to: ROUTES.ppdsInactive },
  { label: "Staff", icon: <icons.Users size={18} />, to: ROUTES.staff },
  { label: "Rumah Sakit", icon: <icons.Hospital size={18} />, to: ROUTES.hospital },
  { label: "Stase", icon: <icons.Grid2X2 size={18} />, to: ROUTES.stase },
  { label: "Penilaian Logbook", icon: <icons.FileText size={18} />, to: ROUTES.penilaianLogbook },
  {
    label: "Rekap",
    icon: <icons.FileStack size={18} />,
    children: [
      // { label: "Rekap Report", to: ROUTES.rekapReport },
      { label: "Rekap Penilaian", to: ROUTES.rekapPenilaian },
      { label: "Rekap Logbook", to: ROUTES.rekapLogbook },
    ],
  },
  { label: "Profile", icon: <icons.User size={18} />, to: ROUTES.profile },
  { label: "Logout", icon: <icons.LogOut size={18} />, to: ROUTES.logout },
];
