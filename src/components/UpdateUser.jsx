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
  const [updateValue, setUpdateValue] = useState("role");

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

    const body =
      updateValue === "role"
        ? { field: "role", value: e.target.role.value }
        : { field: "status", value: e.target.status.value };

    body.profileId = profileId;

    try {
      const response = await fetch(
        `${PROFILE_SERVICE_URL}/api/admin/profiles/${searchedProfile._id}`,
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

  return (
    <main>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <>
          <h1>{`${searchedProfile?.name?.firstName}'s Details`}</h1>
          <div>
            <button onClick={() => setUpdateValue("role")}>Role</button>
            <button onClick={() => setUpdateValue("status")}>Status</button>
          </div>
          <form onSubmit={handleUpdateUserFormSubmit}>
            {updateValue === "role" && (
              <>
                <label htmlFor="role">Role</label>
                <select name="role" id="role">
                  {Object.entries(ROLES).map(([role, value]) => (
                    <option key={value.id} value={role}>
                      {value.id}
                    </option>
                  ))}
                </select>
              </>
            )}
            {updateValue === "status" && (
              <>
                <label htmlFor="status">Status</label>
                <select name="status" id="status">
                  {Object.entries(STATUSES).map(([status, value]) => (
                    <option key={value.id} value={status}>
                      {value.id}
                    </option>
                  ))}
                </select>
              </>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating" : "Update"}
            </button>

            <Link to="/dashboard">Cancel</Link>
          </form>
        </>
      )}
    </main>
  );
}

export default UpdateUser;
