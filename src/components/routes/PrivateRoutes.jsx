import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PUBLIC_PATHS } from "../../constants/paths";

function PrivateRoutes() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const location = useLocation();

  // Allow unauthenticated users only to public paths
  if (!accessToken) {
    return PUBLIC_PATHS.has(location.pathname) ? (
      <Outlet />
    ) : (
      <Navigate to="/login" replace />
    );
  }

  if (PUBLIC_PATHS.has(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PrivateRoutes;
