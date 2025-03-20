import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ROLES } from "../constants/roles";
import { STATUSES } from "../constants/statuses";

import { constructUrl } from "../utils/url";
import { formatDate } from "../utils/date";

function UpdateUser() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { profileId } = useParams();

  const navigate = useNavigate();

  const [searchedProfile, setSearchedProfile] = useState(null);
  const [fields, setFields] = useState({});

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_SERVER_SERVICE_URL;
      const endpoint = "/api/admin/profiles/:profileId";
      const params = { profileId };

      const url = constructUrl(baseUrl, endpoint, params);

      const options = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await fetch(url, options);

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error.message);
        }

        setSearchedProfile(result.data.profile);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [accessToken, profileId]);

  const handleUpdateUserFormSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const baseUrl = import.meta.env.VITE_SERVER_SERVICE_URL;
    const endpoint = "/api/admin/profiles/:profileId";
    const params = { profileId };

    const url = constructUrl(baseUrl, endpoint, params);

    const options = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields }),
    };

    try {
      const response = await fetch(url, options);

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <>
        <h1>{`${searchedProfile?.name?.firstName}'s Details`}</h1>

        <form onSubmit={handleUpdateUserFormSubmit}>
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            defaultValue={searchedProfile.role}
            onChange={handleFieldChange}
            required
          >
            {Object.entries(ROLES).map(([role, value]) => (
              <option key={value.id} value={role}>
                {value.id}
              </option>
            ))}
          </select>

          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            defaultValue={searchedProfile.status}
            onChange={handleFieldChange}
            required
          >
            {Object.entries(STATUSES).map(([status, value]) => (
              <option key={value.id} value={status}>
                {value.id}
              </option>
            ))}
          </select>

          <label htmlFor="cohort">Cohort</label>
          <input
            type="number"
            name="cohort"
            id="cohort"
            defaultValue={searchedProfile.cohort}
            onChange={handleFieldChange}
            pattern="\d{4}"
          />

          <label htmlFor="graduationDate">Graduation Date</label>
          <input
            type="date"
            name="graduationDate"
            id="graduationDate"
            defaultValue={formatDate(searchedProfile.graduationDate)}
            onChange={handleFieldChange}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating" : "Update"}
          </button>

          <Link to="/dashboard">Cancel</Link>
        </form>
      </>
    </main>
  );
}

export default UpdateUser;
