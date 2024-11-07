import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AllProfiles() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [profiles, setProfiles] = useState([]);
  const [profileStatus, setProfileStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getAllProfiles = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/profiles?status=${profileStatus}`,
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
          throw new Error(result.error);
        }

        setProfiles(result.data.profiles);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllProfiles();
  }, [accessToken, profileStatus]);

  return (
    <>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <>
          <h1>All Profiles</h1>
          <div>
            <label htmlFor="status">Status: </label>
            <select
              name="status"
              id="status"
              defaultValue="active"
              onChange={(e) => setProfileStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="all">All</option>
            </select>
          </div>
          <ul>
            <li>Name</li>
            <li>Role</li>
            <li>Status</li>
            <li>Last Updated</li>
            <li>Action</li>
          </ul>
          {profiles &&
            profiles.map((profile) => (
              <ul key={profile._id}>
                <li>{profile.name.first}</li>
                <li>{profile.role}</li>
                <li>{profile.status}</li>
                <li>{new Date(profile.updatedAt).toLocaleDateString()}</li>
                <li>
                  <button
                    onClick={() =>
                      navigate(`/admin/update/profile/${profile.userId}`)
                    }
                  >
                    Update
                  </button>
                </li>
              </ul>
            ))}
        </>
      )}
    </>
  );
}

export default AllProfiles;
