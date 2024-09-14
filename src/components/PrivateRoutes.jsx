import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoutes() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoutes;
