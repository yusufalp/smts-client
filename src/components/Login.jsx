import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../store/features/authSlice";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const body = { username, password };

    try {
      const response = await fetch(`http://localhost:8080/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const currentUser = result.data.user;
      const accessToken = result.data.accessToken;

      dispatch(login({ currentUser, accessToken }));

      navigate("/dashboard");
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const bottomText = "Don't have an account?";

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
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p className="text-center">
        {bottomText} <Link to="/signup">Signup</Link>
      </p>
    </main>
  );
}

export default Login;
