import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);

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
            <li>
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
