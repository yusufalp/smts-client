import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../store/features/authSlice";
import { removeProfile } from "../store/features/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Header() {
  const userProfile = useSelector((state) => state.user.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
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
      console.log(error);
    }
  };

  return (
    <header>
      <nav>
        {userProfile ? (
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li onClick={handleLogout}>
              <Link>Logout</Link>
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
    </header>
  );
}

export default Header;
