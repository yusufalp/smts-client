import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../store/features/authSlice";
import { setProfile } from "../store/features/userSlice";

const API_AUTH_URL = import.meta.env.VITE_AUTH_URL;
const API_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const body = { username, password };

    try {
      const loginResponse = await fetch(`${API_AUTH_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const loginResult = await loginResponse.json();

      if (loginResult.error) {
        throw new Error(loginResult.error.message);
      }

      const { accessToken, expiresAt } = loginResult.data;

      dispatch(login({ accessToken, expiresAt }));

      const profileResponse = await fetch(
        `${API_SERVER_URL}/api/profiles/profile`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const profileResult = await profileResponse.json();

      if (profileResult.error) {
        navigate("/create-profile");
      } else {
        const { profile } = profileResult.data;

        dispatch(setProfile({ profile }));
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleLoginSubmit}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
          Show Password
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
      <p className="text-center">
        {`Don't have an account?`} <Link to="/signup">Signup</Link>
      </p>
    </main>
  );
}

export default Login;
