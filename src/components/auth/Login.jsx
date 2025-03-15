import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../store/features/authSlice";
import { setProfile } from "../../store/features/userSlice";

import { constructUrl } from "../../utils/url";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const userBaseUrl = import.meta.env.VITE_USER_SERVICE_URL;
      const userEndpoint = "/users/login";

      const userUrl = constructUrl(userBaseUrl, userEndpoint);

      const userOptions = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      };

      const loginResponse = await fetch(userUrl, userOptions);

      const loginResult = await loginResponse.json();

      if (loginResult.error || !loginResponse.ok) {
        throw new Error(loginResult.error.message || "Failed to login.");
      }

      const { accessToken, expiresAt } = loginResult.data;

      const profileBaseUrl = import.meta.env.VITE_SERVER_SERVICE_URL;
      const profileEndpoint = "/api/profiles/profile";

      const profileUrl = constructUrl(profileBaseUrl, profileEndpoint);

      const profileOptions = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const profileResponse = await fetch(profileUrl, profileOptions);

      const profileResult = await profileResponse.json();

      if (profileResult.error || !profileResponse.ok) {
        throw new Error(profileResult.error.message || "Failed to login.");
      }

      const { profile } = profileResult.data;

      dispatch(login({ accessToken, expiresAt }));
      dispatch(setProfile({ profile }));

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleLoginSubmit}>
        <h1>Welcome back</h1>
        <p>Login to your account </p>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="show">
            <input
              type="checkbox"
              name="show"
              id="show"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            {" Show Password"}
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="error">{error}</p>}

        <p className="cta">
          {`Don't have an account?`} <Link to="/signup">Signup</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
