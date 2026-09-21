// Central export file for all pages with lazy loading
import { lazyLoad } from '@/components/LazyLoad';

// Auth Pages
export const LoginPage = lazyLoad(() => import('./auth/login/LoginPage'));

// Example Pages
export const ExamplePage = lazyLoad(() => import('./example/example/ExamplePage'));
export const ExampleDetailPage = lazyLoad(() => import('./example/exampleDetail/ExampleDetailPage'));
export const ExampleItemPage = lazyLoad(() => import('./example/exampleItem/ExampleItemPage'));
export const ExampleSubItemPage = lazyLoad(() => import('./example/exampleSubItem/ExampleSubItemPage'));

// Admin Pages - Dashboard
export const DashboardPage = lazyLoad(() => import('./admin/dashboard/dashboard/DashboardPage'));
export const UnverifiedLogbookPage = lazyLoad(() => import('./admin/dashboard/unverifiedLogbook/UnverifiedLogbookPage'));
export const UnverifiedLogbookDetailPage = lazyLoad(() => import('./admin/dashboard/unverifiedLogbookDetail/UnverifiedLogbookDetailPage'));

// Admin Pages - PPDS
export const PpdsListPage = lazyLoad(() => import('./admin/ppds/ppdsList/PpdsListPage'));
export const PpdsInactiveListPage = lazyLoad(() => import('./admin/ppds/ppdsInactiveList/PpdsInactiveListPage'));
export const PpdsCreatePage = lazyLoad(() => import('./admin/ppds/ppdsCreate/PpdsCreatePage'));
export const PpdsDetailPage = lazyLoad(() => import('./admin/ppds/ppdsDetail/PpdsDetailPage'));
export const PpdsChangePasswordPage = lazyLoad(() => import('./admin/ppds/ppdsChangePassword/PpdsChangePasswordPage'));
export const PpdsLogbookPage = lazyLoad(() => import('./admin/ppds/ppdsLogbook/PpdsLogbookPage'));
export const PpdsLogbookDetailPage = lazyLoad(() => import('./admin/ppds/ppdsLogbookDetail/PpdsLogbookDetailPage'));

// Admin Pages - Staff
export const StaffListPage = lazyLoad(() => import('./admin/staff/staffList/StaffListPage'));
export const StaffCreatePage = lazyLoad(() => import('./admin/staff/staffCreate/StaffCreatePage'));
export const StaffDetailPage = lazyLoad(() => import('./admin/staff/staffDetail/StaffDetailPage'));
export const StaffChangePasswordPage = lazyLoad(() => import('./admin/staff/staffChangePassword/StaffChangePasswordPage'));
export const StaffLogbookPage = lazyLoad(() => import('./admin/staff/staffLogbook/StaffLogbookPage'));
export const StaffLogbookDetailPage = lazyLoad(() => import('./admin/staff/staffLogbookDetail/StaffLogbookDetailPage'));

// Admin Pages - Hospital
export const HospitalListPage = lazyLoad(() => import('./admin/hospital/hospitalList/HospitalListPage'));
export const HospitalFormPage = lazyLoad(() => import('./admin/hospital/hospitalForm/HospitalFormPage'));

// Admin Pages - Stase
export const StaseListPage = lazyLoad(() => import('./admin/stase/staseList/StaseListPage'));
export const StaseFormPage = lazyLoad(() => import('./admin/stase/staseForm/StaseFormPage'));

// Admin Pages - Penilaian Logbook
export const PenilaianLogbookListPage = lazyLoad(() => import('./admin/penilaianLogbook/penilaianLogbookList/PenilaianLogbookListPage'));
export const PenilaianLogbookStatusPage = lazyLoad(() => import('./admin/penilaianLogbook/penilaianLogbookStatus/PenilaianLogbookStatusPage'));
export const PenilaianLogbookStatusListPage = lazyLoad(() => import('./admin/penilaianLogbook/penilaianLogbookStatusList/PenilaianLogbookStatusListPage'));
export const PenilaianLogbookDetailPage = lazyLoad(() => import('./admin/penilaianLogbook/penilaianLogbookDetail/PenilaianLogbookDetailPage'));

// Admin Pages - Rekap
export const RekapReportPage = lazyLoad(() => import('./admin/rekap/rekapReport/RekapReportPage'));
export const RekapReportDetailPage = lazyLoad(() => import('./admin/rekap/rekapReportDetail/RekapReportDetailPage'));
export const RekapPenilaianPage = lazyLoad(() => import('./admin/rekap/rekapPenilaian/RekapPenilaianPage'));
export const RekapPenilaianDetailPage = lazyLoad(() => import('./admin/rekap/rekapPenilaianDetail/RekapPenilaianDetailPage'));
export const RekapLogbookPage = lazyLoad(() => import('./admin/rekap/rekapLogbook/RekapLogbookPage'));
export const RekapLogbookDetailPage = lazyLoad(() => import('./admin/rekap/rekapLogbookDetail/RekapLogbookDetailPage'));

// Profile Pages
export const ProfilePage = lazyLoad(() => import('./profile/profile/ProfilePage'));
export const ProfileEditPage = lazyLoad(() => import('./profile/profileEdit/ProfileEditPage'));
