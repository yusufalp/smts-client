import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../store/features/authSlice";
import { addProfile } from "../store/features/userSlice";
import { validatePassword } from "../utils/validations";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Signup() {
  const [signupFormData, setSignupFormData] = useState({
    first: "",
    last: "",
    username: "",
    password: "",
  });
  const [signupFormErrors, setSignupFormErrors] = useState({
    first: "",
    last: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFormValid = () => {
    return !Object.values(signupFormErrors).some((error) => error !== "");
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;

    setSignupFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkPassword = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setSignupFormErrors((prevErrors) => ({
        ...prevErrors,
        password: validatePassword(value),
      }));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(signupFormData),
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
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          value={signupFormData.first}
          onChange={handleSignupInputChange}
        />
        {signupFormErrors.first && (
          <p className="error">{signupFormErrors.first}</p>
        )}

        <label htmlFor="last">Last name</label>
        <input
          type="text"
          name="last"
          id="last"
          required
          value={signupFormData.last}
          onChange={handleSignupInputChange}
        />
        {signupFormErrors.last && (
          <p className="error">{signupFormErrors.last}</p>
        )}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          value={signupFormData.username}
          onChange={handleSignupInputChange}
        />
        {signupFormErrors.username && (
          <p className="error">{signupFormErrors.username}</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          required
          value={signupFormData.password}
          onChange={handleSignupInputChange}
          onBlur={checkPassword}
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

        {signupFormErrors.password && (
          <p className="error">{signupFormErrors.password}</p>
        )}

        <button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading ? "Creating account..." : "Create"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
      <p className="text-center">
        {`Already have an account?`} <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default Signup;
