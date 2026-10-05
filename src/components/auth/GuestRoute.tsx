import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/utils/routes";

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Still initializing auth state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#087F5B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat...</p>
        </div>
      </div>
    );
  }

  // Already authenticated - redirect to previous page
  if (isAuthenticated) {
    const from = location.state?.from;

    const redirectTo = from
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : ROUTES.dashboard;

    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return <>{children}</>;
};