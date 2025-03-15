import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";

import { constructUrl } from "../../utils/url";
import { validateGithubUrl, validateLinkedinUrl } from "../../utils/validate";

function LinksForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [linksFormData, setLinksFormData] = useState({
    portfolioUrl: profile?.links?.portfolioUrl || "",
    linkedinUrl: profile?.links?.linkedinUrl || "",
    githubUrl: profile?.links?.githubUrl || "",
  });
  const [linksFormErrors, setLinksFormErrors] = useState({
    linkedinUrl: "",
    githubUrl: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLinksFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkLinkedinUrl = (e) => {
    const { name, value } = e.target;

    if (name === "linkedinUrl") {
      setLinksFormErrors((prevErrors) => ({
        ...prevErrors,
        linkedinUrl: validateLinkedinUrl(value),
      }));
    }
  };

  const checkGithubUrl = (e) => {
    const { name, value } = e.target;

    if (name === "githubUrl") {
      setLinksFormErrors((prevErrors) => ({
        ...prevErrors,
        githubUrl: validateGithubUrl(value),
      }));
    }
  };

  const isFormValid = () => {
    return !Object.values(linksFormErrors).some((error) => error !== "");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

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
      body: JSON.stringify({ field: "links", value: linksFormData }),
    };

    try {
      const response = await fetch(url, options);

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
      <form onSubmit={handleFormSubmit}>
        <h1>Links</h1>
        <p>Update personal links below</p>

        <div>
          <label htmlFor="portfolioUrl">Portfolio</label>
          <input
            type="url"
            name="portfolioUrl"
            id="portfolioUrl"
            placeholder="e.g. https://www.johnwick.com"
            value={linksFormData.portfolioUrl}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="linkedinUrl">LinkedIn</label>
          <input
            type="url"
            name="linkedinUrl"
            id="linkedinUrl"
            placeholder="e.g. https://www.linkedin.com/in/john-wick"
            value={linksFormData.linkedinUrl}
            onChange={handleInputChange}
            onBlur={checkLinkedinUrl}
          />
          {linksFormErrors.linkedinUrl && (
            <p className="error">{linksFormErrors.linkedinUrl}</p>
          )}
        </div>

        <div>
          <label htmlFor="githubUrl">GitHub</label>
          <input
            type="url"
            name="githubUrl"
            id="githubUrl"
            placeholder="e.g. https://www.github.com/john-wick"
            value={linksFormData.githubUrl}
            onChange={handleInputChange}
            onBlur={checkGithubUrl}
          />
          {linksFormErrors.githubUrl && (
            <p className="error">{linksFormErrors.githubUrl}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || !isFormValid()}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>

        <Link to="/profile">Cancel</Link>

        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export default LinksForm;
