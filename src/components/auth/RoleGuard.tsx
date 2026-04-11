import { RoleEnum } from "@/types";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/utils/routes";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleEnum[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  // TODO: Ambil role dari session/auth context
  const userRole = RoleEnum.INSTITUTION; // Placeholder

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
};
