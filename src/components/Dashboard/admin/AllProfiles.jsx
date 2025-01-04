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
    firstName: "",
    lastName: "",
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

    const applyFilter = setTimeout(() => {
      getAllProfiles();
    }, 1000);

    return () => clearTimeout(applyFilter);
  }, [accessToken, query]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <h2>All Profiles</h2>

      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={query.firstName}
          onChange={(e) => updateQuery({ firstName: e.target.value })}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={query.lastName}
          onChange={(e) => updateQuery({ lastName: e.target.value })}
        />

        <label htmlFor="status">Status: </label>
        <select
          name="status"
          id="status"
          value={query.status}
          onChange={(e) => updateQuery({ status: e.target.value })}
        >
          <option value="all">All</option>
          {Object.entries(STATUSES).map(([status, value]) => (
            <option key={value.id} value={status}>
              {value.id}
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
          {Object.entries(ROLES).map(([role, value]) => (
            <option key={value.id} value={role}>
              {value.id}
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
            <li>Status</li>
            <li>Role</li>
            <li>Last Updated</li>
            <li>Action</li>
          </ul>
          {profiles.map((profile) => (
            <ul key={profile._id}>
              <li>{profile.name.firstName}</li>
              <li>{profile.name.lastName}</li>
              <li>{STATUSES[profile.profileStatus].id}</li>
              <li>{ROLES[profile.role].id}</li>
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
