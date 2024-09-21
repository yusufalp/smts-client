import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../store/features/authSlice";
import { addProfile } from "../store/features/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Signup() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const body = { first, last, username, password };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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

      const accessToken = result.data.accessToken;
      const expiresAt = result.data.expiresAt;
      const profile = result.data.profile;

      dispatch(login({ accessToken, expiresAt }));
      dispatch(addProfile({ profile }));

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const bottomText = "Already have an account?";

  return (
    <main>
      <form onSubmit={handleSignupSubmit}>
        <h1>Create an account</h1>
        <label htmlFor="first">First name</label>
        <input
          type="text"
          name="first"
          id="first"
          required
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <label htmlFor="last">Last name</label>
        <input
          type="text"
          name="last"
          id="last"
          required
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      <p className="text-center">
        {bottomText} <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default Signup;
