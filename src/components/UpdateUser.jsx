import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ROLES } from "../constants/roles";
import { STATUSES } from "../constants/statuses";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function UpdateUser() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { profileId } = useParams();

  const navigate = useNavigate();

  const [searchedProfile, setSearchedProfile] = useState(null);
  const [updateField, setUpdateField] = useState("role");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(
          `${PROFILE_SERVICE_URL}/api/admin/profiles/${profileId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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

    setIsSubmitting(true);
    setError("");

    const body = { field: updateField, value: e.target[updateField].value };

    try {
      const response = await fetch(
        `${PROFILE_SERVICE_URL}/api/admin/profiles/${profileId}`,
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

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
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

        <div>
          <label htmlFor="field">Update: </label>
          <select
            name="info"
            id="info"
            value={updateField}
            onChange={(e) => setUpdateField(e.target.value)}
          >
            <option value="default" disabled>
              Select
            </option>
            <option value="profileStatus">Profile Status</option>
            <option value="role">Role</option>
            <option value="cohort">Cohort</option>
            <option value="graduationDate">Graduation Date</option>
          </select>
        </div>

        <form onSubmit={handleUpdateUserFormSubmit}>
          {updateField === "role" && (
            <>
              <label htmlFor="role">Role</label>
              <select name="role" id="role" required>
                {Object.entries(ROLES).map(([role, value]) => (
                  <option key={value.id} value={role}>
                    {value.id}
                  </option>
                ))}
              </select>
            </>
          )}

          {updateField === "profileStatus" && (
            <>
              <label htmlFor="profileStatus">Status</label>
              <select name="profileStatus" id="profileStatus" required>
                {Object.entries(STATUSES).map(([status, value]) => (
                  <option key={value.id} value={status}>
                    {value.id}
                  </option>
                ))}
              </select>
            </>
          )}

          {updateField === "cohort" && (
            <>
              <label htmlFor="cohort">Cohort</label>
              <input
                type="number"
                name="cohort"
                id="cohort"
                pattern="\d{4}"
                required
              />
            </>
          )}

          {updateField === "graduationDate" && (
            <>
              <label htmlFor="graduationDate">Graduation Date</label>
              <input
                type="date"
                name="graduationDate"
                id="graduationDate"
                required
              />
            </>
          )}

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
