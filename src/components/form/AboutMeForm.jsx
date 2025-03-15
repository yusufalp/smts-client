import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";

import { constructUrl } from "../../utils/url";

function AboutMeForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [aboutMeFormData, setAboutMeFormData] = useState({
    firstName: profile?.name?.firstName || "",
    middleName: profile?.name?.middleName || "",
    lastName: profile?.name?.lastName || "",
    bio: profile?.bio || "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAboutMeFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const baseUrl = import.meta.env.VITE_SERVER_SERVICE_URL;
    const endpoint = "/api/profiles/profile";

    const url = constructUrl(baseUrl, endpoint);

    const options = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ field: "about", value: aboutMeFormData }),
    };

    try {
      const response = await fetch(url, options);

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.error.message || "Failed to update");
      }

      const profile = result.data.profile;

      dispatch(setProfile({ profile }));
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <h1>About</h1>
        <p>Update profile info below</p>

        <div>
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={aboutMeFormData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="middleName">Middle name</label>
          <input
            type="text"
            name="middleName"
            id="middleName"
            value={aboutMeFormData.middleName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={aboutMeFormData.lastName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            value={aboutMeFormData.bio}
            placeholder="Tell us about yourself"
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>

        <Link to="/profile">Cancel</Link>

        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export default AboutMeForm;
