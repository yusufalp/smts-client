import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/features/authSlice";

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
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
    navigate("/login");
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
