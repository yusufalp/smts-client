import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ROLES } from "../data/roles";
import { STATUSES } from "../data/statuses";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UpdateUser() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [updateValue, setUpdateValue] = useState("role");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profiles/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error.message);
        }

        setProfile(result.data.profile);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [accessToken, userId]);

  const handleUpdateUserFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    const body =
      updateValue === "role"
        ? { field: "role", value: e.target.role.value }
        : { field: "status", value: e.target.status.value };

    body.userId = userId;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        method: "POST",
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
          <h1>{profile?.name?.first}</h1>
          <div>
            <button onClick={() => setUpdateValue("role")}>Role</button>
            <button onClick={() => setUpdateValue("status")}>Status</button>
          </div>
          <form onSubmit={handleUpdateUserFormSubmit}>
            {updateValue === "role" && (
              <>
                <label htmlFor="role">Role</label>
                <select name="role" id="role">
                  {Object.keys(ROLES).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </>
            )}
            {updateValue === "status" && (
              <>
                <label htmlFor="status">Status</label>
                <select name="status" id="status">
                  {Object.keys(STATUSES).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </>
            )}
            <button type="submit" disabled={isSubmitting}>
              {" "}
              {isSubmitting ? "Updating" : "Update"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}

export default UpdateUser;
