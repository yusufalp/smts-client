import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../store/features/authSlice";
import { removeProfile } from "../../store/features/userSlice";

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeProfile());

    setIsMenuOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const menuToggleIcon = `fa-solid ${isMenuOpen ? "fa-x" : "fa-bars"}`;

  return (
    <header>
      <nav>
        {accessToken ? (
          <div className="menu-container">
            <button className="menu-toggle" onClick={toggleDropdown}>
              <i className={menuToggleIcon}></i>
            </button>
            {isMenuOpen && (
              <ul className="menu-dropdown">
                <li className="menu-link" onClick={handleMenuItemClick}>
                  <Link to="/dashboard">Dashboard</Link>
                </li>

                <li className="menu-separator"></li>

                <li className="menu-link" onClick={handleMenuItemClick}>
                  <Link to="/profile">Profile</Link>
                </li>

                <li className="menu-separator"></li>

                <li>
                  <button className="menu-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button className="menu-login" onClick={handleLogin}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
