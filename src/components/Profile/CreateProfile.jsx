import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { validateEmail } from "../../utils/validations";
import { setProfile } from "../../store/features/userSlice";

const API_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function CreateProfile() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [profileData, setProfileData] = useState({
    first: "",
    last: "",
    email: "",
  });
  const [profileDataErrors, setProfileDataError] = useState({
    first: "",
    last: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFormValid = () => {
    return !Object.values(profileDataErrors).some((error) => error !== "");
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkEmail = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setProfileDataError((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value),
      }));
    }
  };

  const handleCreateProfileSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_SERVER_URL}/api/profiles/profile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { profile } = result.data;

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
      <form onSubmit={handleCreateProfileSubmit}>
        <h1>Create your profile</h1>
        <p>All fields are required</p>
        <label htmlFor="first">First name</label>
        <input
          type="text"
          name="first"
          id="first"
          required
          value={profileData.first}
          onChange={handleProfileInputChange}
        />
        {profileDataErrors.first && (
          <p className="error">{profileDataErrors.first}</p>
        )}

        <label htmlFor="last">Last name</label>
        <input
          type="text"
          name="last"
          id="last"
          required
          value={profileData.last}
          onChange={handleProfileInputChange}
        />
        {profileDataErrors.last && (
          <p className="error">{profileDataErrors.last}</p>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={profileData.email}
          onChange={handleProfileInputChange}
          onBlur={checkEmail}
        />
        {profileDataErrors.email && (
          <p className="error">{profileDataErrors.email}</p>
        )}

        <button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading ? "Creating profile..." : "Create"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}

export default CreateProfile;
