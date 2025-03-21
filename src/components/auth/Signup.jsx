import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../store/features/authSlice";
import { setProfile } from "../../store/features/userSlice.js";

import { validateEmail, validatePassword } from "../../utils/validate.js";
import { constructUrl } from "../../utils/url.js";

function Signup() {
  const [signupFormData, setSignupFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [signupFormErrors, setSignupFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;

    setSignupFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkEmail = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setSignupFormErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value),
      }));
    }
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

  const isFormValid = () => {
    return !Object.values(signupFormErrors).some((error) => error !== "");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setError(null);
    setIsLoading(true);

    try {
      const userBaseUrl = import.meta.env.VITE_USER_SERVICE_URL;
      const userEndpoint = "/users/signup";

      const userUrl = constructUrl(userBaseUrl, userEndpoint);

      const userOptions = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(signupFormData),
      };

      const signupResponse = await fetch(userUrl, userOptions);

      const signupResult = await signupResponse.json();

      if (signupResult.error || !signupResponse.ok) {
        throw new Error(signupResult.error.message || "Failed to signup.");
      }

      const { accessToken, expiresAt } = signupResult.data;

      const profileBaseUrl = import.meta.env.VITE_SERVER_SERVICE_URL;
      const profileEndpoint = "/api/profiles/profile";

      const profileUrl = constructUrl(profileBaseUrl, profileEndpoint);

      const profileOptions = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(signupFormData),
      };

      const profileResponse = await fetch(profileUrl, profileOptions);

      const profileResult = await profileResponse.json();

      if (profileResult.error || !profileResponse.ok) {
        throw new Error(profileResult.error.message || "Failed to signup.");
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
      <form onSubmit={handleSignupSubmit}>
        <h1>Get Started</h1>
        <p>Let us create your account</p>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={signupFormData.firstName}
            onChange={handleSignupInputChange}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={signupFormData.lastName}
            onChange={handleSignupInputChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={signupFormData.email}
            onChange={handleSignupInputChange}
            onBlur={checkEmail}
          />
          {signupFormErrors.email && (
            <p className="error">{signupFormErrors.email}</p>
          )}
        </div>

        <div>
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
        </div>

        <div>
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
          {signupFormErrors.password && (
            <p className="error">{signupFormErrors.password}</p>
          )}

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

        <button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading ? "Signing up..." : "Signup"}
        </button>

        {error && <p className="error">{error}</p>}

        <p className="cta">
          {`Already have an account?`} <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;
