import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "@/utils/routes";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { RoleEnum } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { LoginPage, ExamplePage, ExampleDetailPage, ExampleItemPage, ExampleSubItemPage } from "@/pages";

function App() {
  const { init, isInitialized } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />

        {/* Example Routes - without AdminLayout */}
        <Route path={ROUTES.example} element={<ExamplePage />} />
        <Route
          path={ROUTES.exampleDetail()}
          element={<ExampleDetailPage />}
        />
        <Route
          path={ROUTES.exampleItem(":exampleId")}
          element={<ExampleItemPage />}
        />
        <Route
          path={ROUTES.exampleSubItem(":exampleId", ":itemId")}
          element={<ExampleSubItemPage />}
        />

        {/* Auth Routes - Guest only (redirect if already logged in) */}
        <Route
          path={ROUTES.login}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.logout}
          element={<PlaceholderPage title="Logout" />}
        />

        {/* Protected Admin Routes */}
        <Route
          path={ROUTES.dashboard}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Dashboard" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* PPDS Routes */}
        <Route
          path={ROUTES.ppds}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS List" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsCreate}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Create PPDS" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsChangePassword(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Change Password" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsLogbook(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsLogbookDetail(":idUser", ":idLogbook")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* PPDS Inactive Routes */}
        <Route
          path={ROUTES.ppdsInactive}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive List" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsInactiveDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsInactiveLogbook(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ppdsInactiveLogbookDetail(":idUser", ":idLogbook")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path={ROUTES.staff}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff List" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staffCreate}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Create Staff" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staffDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staffChangePassword(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Change Password" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staffLogbook(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staffLogbookDetail(":idUser", ":idLogbook")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Stase Routes */}
        <Route
          path={ROUTES.stase}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Stase List" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staseCreate}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Create Stase" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.staseDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Stase Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Penilaian Logbook Routes */}
        <Route
          path={ROUTES.penilaianLogbook}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Penilaian Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookDetail(":idLogbookCategory")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Penilaian Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookScoredLogbook(":idLogbookCategory")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Scored Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookScoredLogbookDetail(
            ":idLogbookCategory",
            ":idLogbook"
          )}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Scored Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookUnscoredLogbook(":idLogbookCategory")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Unscored Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookUnscoredLogbookDetail(
            ":idLogbookCategory",
            ":idLogbook"
          )}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Unscored Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Rekap Routes */}
        <Route
          path={ROUTES.rekapReport}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Report" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.rekapReportDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Report Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.rekapPenilaian}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Penilaian" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.rekapPenilaianDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Penilaian Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.rekapLogbook}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Logbook" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.rekapLogbookDetail(":idUser")}
          element={
            <ProtectedRoute allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Logbook Detail" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile Route */}
        <Route
          path={ROUTES.profile}
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlaceholderPage title="Profile" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.profileEdit}
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlaceholderPage title="Edit Profile" />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
