import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProfile } from "../../store/features/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LinksForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userProfile = useSelector((state) => state.user.profile);

  const [linksFormData, setLinksFormData] = useState({
    portfolio: userProfile.links?.portfolio || "",
    linkedin: userProfile.links?.linkedin || "",
    github: userProfile.links?.github || "",
  });

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

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/profiles/update-links`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(linksFormData),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const profile = result.data.profile;

      dispatch(addProfile({ profile }));
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
      <button type="submit">Update</button>
    </form>
  );
}

export default LinksForm;
