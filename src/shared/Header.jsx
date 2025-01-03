import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../store/features/authSlice";
import { removeProfile } from "../store/features/userSlice";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${USER_SERVICE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
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
