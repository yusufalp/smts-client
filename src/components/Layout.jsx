import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { logout } from "../store/features/authSlice";
import { removeProfile } from "../store/features/userSlice";

function Layout({ children }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const expiresAt = useSelector((state) => state.auth.expiresAt);

  const isTokenExpired = Date.now() > expiresAt * 1000;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || isTokenExpired) {
      dispatch(logout());
      dispatch(removeProfile());
      navigate("/login");
    }
  }, [accessToken, dispatch, isTokenExpired, navigate]);

  return <>{children}</>;
}

Layout.propTypes = {
  children: PropTypes.array,
};

export default Layout;
