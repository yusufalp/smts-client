import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function AboutMeForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [aboutMeFormData, setAboutMeFormData] = useState({
    firstName: profile?.name?.firstName || "",
    lastName: profile?.name?.lastName || "",
    bio: profile?.bio || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNameInputChange = (e) => {
    const { name, value } = e.target;

    setAboutMeFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNameFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const body = { field: "about", value: aboutMeFormData };

    try {
      const response = await fetch(
        `${PROFILE_SERVICE_URL}/api/profiles/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
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
      <form onSubmit={handleNameFormSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          required
          value={aboutMeFormData.firstName}
          onChange={handleNameInputChange}
        />

        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={aboutMeFormData.lastName}
          onChange={handleNameInputChange}
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          id="bio"
          value={aboutMeFormData.bio}
          placeholder="Tell us about yourself"
          onChange={handleNameInputChange}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating" : "Update"}
        </button>
        <Link to="/profile">Cancel</Link>

        {error && <p>{error}</p>}
      </form>
    </>
  );
}

export default AboutMeForm;
