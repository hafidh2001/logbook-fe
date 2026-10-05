import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/utils/routes";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized, user } = useAuthStore();

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

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  // Check role authorization if roles are specified
  if (allowedRoles && user && !allowedRoles.includes(user.role_name)) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
};
