import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PUBLIC_PATHS } from "../constants/paths";

function PrivateRoutes() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const location = useLocation();

  // Allow unauthenticated users only to public paths
  if (!accessToken) {
    return PUBLIC_PATHS[location.pathname] ? (
      <Outlet />
    ) : (
      <Navigate to="/login" replace />
    );
  }

  // If authenticated but no profile, redirect to create profile
  if (!profile) {
    return <Navigate to="/create-profile" replace />;
  }

  // Prevent logged-in users with a profile from accessing public paths or creating profile page
  if (profile) {
    return PUBLIC_PATHS[location.pathname] ? (
      <Navigate to="/dashboard" replace />
    ) : location.pathname === "/create-profile" ? (
      <Navigate to="/profile" replace />
    ) : (
      <Outlet />
    );
  }

  // Authenticated users with a profile can access all other routes
  return <Outlet />;
}

export default PrivateRoutes;
