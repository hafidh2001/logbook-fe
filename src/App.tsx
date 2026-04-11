import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/utils/routes";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { RoleEnum } from "@/types";
import { LoginPage, ExamplePage, ExampleDetailPage, ExampleItemPage, ExampleSubItemPage } from "@/pages";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppWrapper>
        <Routes>
          {/* Example Routes */}
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

          {/* Auth Routes */}
          <Route
            path={ROUTES.login}
            element={<LoginPage />}
          />
          <Route
            path={ROUTES.logout}
            element={<PlaceholderPage title="Logout" />}
          />

          {/* Admin Routes - Only Institution Role */}
          <Route
            path={ROUTES.dashboard}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Dashboard" />
              </RoleGuard>
            }
          />

          {/* PPDS Routes */}
          <Route
            path={ROUTES.ppds}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS List" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsChangePassword(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Change Password" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsLogbook(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Logbook" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsLogbookDetail(":idUser", ":idLogbook")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Logbook Detail" />
              </RoleGuard>
            }
          />

          {/* PPDS Inactive Routes */}
          <Route
            path={ROUTES.ppdsInactive}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Inactive List" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsInactiveDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Inactive Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsInactiveLogbook(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Inactive Logbook" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.ppdsInactiveLogbookDetail(":idUser", ":idLogbook")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="PPDS Inactive Logbook Detail" />
              </RoleGuard>
            }
          />

          {/* Staff Routes */}
          <Route
            path={ROUTES.staff}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Staff List" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.staffDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Staff Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.staffChangePassword(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Staff Change Password" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.staffLogbook(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Staff Logbook" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.staffLogbookDetail(":idUser", ":idLogbook")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Staff Logbook Detail" />
              </RoleGuard>
            }
          />

          {/* Stase Routes */}
          <Route
            path={ROUTES.stase}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Stase List" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.staseDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Stase Detail" />
              </RoleGuard>
            }
          />

          {/* Penilaian Logbook Routes */}
          <Route
            path={ROUTES.penilaianLogbook}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Penilaian Logbook" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.penilaianLogbookDetail(":idLogbookCategory")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Penilaian Logbook Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.penilaianLogbookScoredLogbook(":idLogbookCategory")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Scored Logbook" />
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
                <PlaceholderPage title="Scored Logbook Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.penilaianLogbookUnscoredLogbook(":idLogbookCategory")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Unscored Logbook" />
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
                <PlaceholderPage title="Unscored Logbook Detail" />
              </RoleGuard>
            }
          />

          {/* Rekap Routes */}
          <Route
            path={ROUTES.rekapReport}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Rekap Report" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.rekapReportDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Rekap Report Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.rekapPenilaian}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Rekap Penilaian" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.rekapPenilaianDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Rekap Penilaian Detail" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.rekapLogbook}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Rekap Logbook" />
              </RoleGuard>
            }
          />
          <Route
            path={ROUTES.rekapLogbookDetail(":idUser")}
            element={
              <RoleGuard allowedRoles={[RoleEnum.INSTITUTION]}>
                <PlaceholderPage title="Rekap Logbook Detail" />
              </RoleGuard>
            }
          />

          {/* Profile Route */}
          <Route
            path={ROUTES.profile}
            element={<PlaceholderPage title="Profile" />}
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
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
