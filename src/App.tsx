import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/utils/routes";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { RoleEnum } from "@/types";
import { LoginPage, ExamplePage, ExampleDetailPage, ExampleItemPage, ExampleSubItemPage } from "@/pages";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        {/* Example Routes - without AdminLayout */}
        <Route path={ROUTES.base} element={<ExamplePage />} />
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

        {/* Auth Routes - without AdminLayout */}
        <Route
          path={ROUTES.login}
          element={<LoginPage />}
        />
        <Route
          path={ROUTES.logout}
          element={<PlaceholderPage title="Logout" />}
        />

        {/* Authenticated Routes - with AdminLayout */}
        <Route
          path={ROUTES.dashboard}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Dashboard" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* PPDS Routes */}
        <Route
          path={ROUTES.ppds}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS List" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsCreate}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Create PPDS" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsChangePassword(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Change Password" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsLogbook(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsLogbookDetail(":idUser", ":idLogbook")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* PPDS Inactive Routes */}
        <Route
          path={ROUTES.ppdsInactive}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive List" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsInactiveDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsInactiveLogbook(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ppdsInactiveLogbookDetail(":idUser", ":idLogbook")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="PPDS Inactive Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* Staff Routes */}
        <Route
          path={ROUTES.staff}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff List" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staffCreate}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Create Staff" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staffDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staffChangePassword(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Change Password" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staffLogbook(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staffLogbookDetail(":idUser", ":idLogbook")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Staff Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* Stase Routes */}
        <Route
          path={ROUTES.stase}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Stase List" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staseCreate}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Create Stase" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.staseDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Stase Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* Penilaian Logbook Routes */}
        <Route
          path={ROUTES.penilaianLogbook}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Penilaian Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookDetail(":idLogbookCategory")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Penilaian Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookScoredLogbook(":idLogbookCategory")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Scored Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookScoredLogbookDetail(
            ":idLogbookCategory",
            ":idLogbook"
          )}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Scored Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookUnscoredLogbook(":idLogbookCategory")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Unscored Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.penilaianLogbookUnscoredLogbookDetail(
            ":idLogbookCategory",
            ":idLogbook"
          )}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Unscored Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* Rekap Routes */}
        <Route
          path={ROUTES.rekapReport}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Report" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.rekapReportDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Report Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.rekapPenilaian}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Penilaian" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.rekapPenilaianDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Penilaian Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.rekapLogbook}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Logbook" />
              </AdminLayout>
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.rekapLogbookDetail(":idUser")}
          element={
            <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
              <AdminLayout>
                <PlaceholderPage title="Rekap Logbook Detail" />
              </AdminLayout>
            </RoleGuard>
          }
        />

        {/* Profile Route - with AdminLayout */}
        <Route
          path={ROUTES.profile}
          element={
            <AdminLayout>
              <PlaceholderPage title="Profile" />
            </AdminLayout>
          }
        />
        <Route
          path={ROUTES.profileEdit}
          element={
            <AdminLayout>
              <PlaceholderPage title="Edit Profile" />
            </AdminLayout>
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
