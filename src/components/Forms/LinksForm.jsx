import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function LinksForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [linksFormData, setLinksFormData] = useState({
    portfolio: profile?.links?.portfolio || "",
    linkedin: profile?.links?.linkedin || "",
    github: profile?.links?.github || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLinksInputChange = (e) => {
    const { name, value } = e.target;

    setLinksFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLinksFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const body = { field: "links", value: linksFormData };

    try {
      const response = await fetch(`${PROFILE_SERVICE_URL}/api/profiles/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

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
      <form onSubmit={handleLinksFormSubmit}>
        <h2>Please enter personal links</h2>
        <label htmlFor="portfolio">Portfolio</label>
        <input
          type="url"
          name="portfolio"
          id="portfolio"
          placeholder="e.g. https://www.johnwick.com"
          value={linksFormData.portfolio}
          onChange={handleLinksInputChange}
        />
        <label htmlFor="linkedin">LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          id="linkedin"
          placeholder="e.g. https://www.linkedin.com/in/john-wick"
          value={linksFormData.linkedin}
          onChange={handleLinksInputChange}
        />
        <label htmlFor="github">GitHub</label>
        <input
          type="url"
          name="github"
          id="github"
          placeholder="e.g. https://www.github.com/john-wick"
          value={linksFormData.github}
          onChange={handleLinksInputChange}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating" : "Update"}
        </button>
        <Link to="/profile">Cancel</Link>
      </form>

      {error && <p>{error}</p>}
    </>
  );
}

export default LinksForm;
