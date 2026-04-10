import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/utils/routes";
import { AppWrapper } from "@/components/layout/AppWrapper";
import ExamplePage from "@/pages/example/example/ExamplePage";
import ExampleDetailPage from "@/pages/example/exampleDetail/ExampleDetailPage";
import ExampleSubItemPage from "@/pages/example/exampleSubItem/ExampleSubItemPage";
import ExampleItemPage from "@/pages/example/exampleItem/ExampleItemPage";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppWrapper>
        <Routes>
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
