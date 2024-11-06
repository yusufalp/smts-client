import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PrivateRoutes() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!accessToken) {
    return isAuthRoute ? <Outlet /> : <Navigate to="/login" replace />;
  }

  return isAuthRoute ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default PrivateRoutes;
