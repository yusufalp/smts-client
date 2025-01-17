import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../store/features/authSlice";
import { removeProfile } from "../../store/features/userSlice";
import { constructUrl } from "../../utils/url";

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_USER_SERVICE_URL;
      const endpoint = "/users/logout";

      const url = constructUrl(baseUrl, endpoint);

      const options = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await fetch(url, options);

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.error.message || "Failed to logout");
      }

      dispatch(logout());
      dispatch(removeProfile());

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header>
      <nav>
        {accessToken ? (
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li onClick={handleLogout}>
              <Link disabled={isLoading}>Logout</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        )}
      </nav>

      {error && <p>{error}</p>}
    </header>
  );
}

export default Header;
