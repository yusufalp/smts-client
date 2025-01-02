import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { PAGINATION } from "../../../constants/pagination";
import { ROLES } from "../../../constants/roles";
import { STATUSES } from "../../../constants/statuses";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function AllProfiles() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [profiles, setProfiles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState({
    status: "active",
    role: "all",
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getAllProfiles = async () => {
      const url = new URL(`${PROFILE_SERVICE_URL}/api/admin/profiles`);

      Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(url.href, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setProfiles(result.data.profiles);
        setTotalPages(result.data.pagination.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllProfiles();
  }, [accessToken, query]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <h2>All Profiles</h2>

      <div>
        <label htmlFor="status">Status: </label>
        <select
          name="status"
          id="status"
          value={query.status}
          onChange={(e) => updateQuery({ status: e.target.value })}
        >
          <option value="all">All</option>
          {Object.keys(STATUSES).map((status) => (
            <option key={status} value={STATUSES[status].key}>
              {status}
            </option>
          ))}
        </select>

        <label htmlFor="role">Role:</label>
        <select
          name="role"
          id="role"
          value={query.role}
          onChange={(e) => updateQuery({ role: e.target.value })}
        >
          <option value="all">All</option>
          {Object.keys(ROLES).map((role) => (
            <option key={role} value={ROLES[role].key}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : profiles.length === 0 ? (
        <p>There are no profile to display</p>
      ) : (
        <>
          <ul>
            <li>First Name</li>
            <li>Last Name</li>
            <li>Role</li>
            <li>Status</li>
            <li>Last Updated</li>
            <li>Action</li>
          </ul>
          {profiles.map((profile) => (
            <ul key={profile._id}>
              <li>{profile.name.firstName}</li>
              <li>{profile.name.lastName}</li>
              <li>{profile.role}</li>
              <li>{profile.status}</li>
              <li>{new Date(profile.updatedAt).toLocaleDateString()}</li>
              <li>
                <button
                  onClick={() =>
                    navigate(`/admin/update/profile/${profile._id}`)
                  }
                >
                  Update
                </button>
              </li>
            </ul>
          ))}
        </>
      )}

      {profiles.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => updateQuery({ page: query.page - 1 })}
            disabled={query.page === 1}
          >
            Previous
          </button>
          <span>
            {query.page} of {totalPages}
          </span>
          <button
            onClick={() => updateQuery({ page: query.page + 1 })}
            disabled={query.page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default AllProfiles;
