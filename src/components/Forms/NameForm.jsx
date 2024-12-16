import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";

const API_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function NameForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [nameFormData, setNameFormData] = useState({
    first: "",
    last: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNameInputChange = (e) => {
    const { name, value } = e.target;

    setNameFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNameFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const body = { field: "name", value: nameFormData };

    try {
      const response = await fetch(`${API_SERVER_URL}/api/profiles/profile`, {
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
      <form onSubmit={handleNameFormSubmit}>
        <label htmlFor="first">First name</label>
        <input
          type="text"
          name="first"
          id="first"
          required
          value={nameFormData.first}
          onChange={handleNameInputChange}
        />

        <label htmlFor="last">Last name</label>
        <input
          type="text"
          name="last"
          id="last"
          required
          value={nameFormData.last}
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

export default NameForm;
