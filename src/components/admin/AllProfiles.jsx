import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { PAGINATION } from "../../constants/pagination";
import { STATUSES } from "../../constants/statuses";
import { ROLES } from "../../constants/roles";

import { constructUrl } from "../../utils/url";

function AllProfiles() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState({
    firstName: "",
    lastName: "",
    status: "active",
    role: "all",
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  useEffect(() => {
    const getAllProfiles = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_PROFILE_SERVICE_URL;
      const endpoint = "/api/admin/profiles";
      const params = {};

      const url = constructUrl(baseUrl, endpoint, params, query);

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

        if (result.error || !response.ok) {
          throw new Error(result.error.message || "Failed to get profiles.");
        }

        setData(result.data);
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

  const renderAllProfilesDetails = () => (
    <>
      <ul>
        <li>First Name</li>
        <li>Last Name</li>
        <li>Status</li>
        <li>Role</li>
        <li>Last Updated</li>
      </ul>
      {data.profiles.map((profile) => (
        <ul key={profile._id}>
          <li>
            <Link to={`/admin/update/profile/${profile._id}`}>
              {profile.name.firstName}
            </Link>
          </li>
          <li>{profile.name.lastName}</li>
          <li>{STATUSES[profile.profileStatus].id}</li>
          <li>{ROLES[profile.role].id}</li>
          <li>{new Date(profile.updatedAt).toLocaleDateString()}</li>
        </ul>
      ))}
    </>
  );

  const renderPaginationControls = () => (
    <div className="pagination">
      <button
        onClick={() => updateQuery({ page: query.page - 1 })}
        disabled={query.page === 1}
      >
        Previous
      </button>
      <span>
        Page {query.page} of {data.pagination.totalPages}
      </span>
      <button
        onClick={() => updateQuery({ page: query.page + 1 })}
        disabled={query.page === data.pagination.totalPages}
      >
        Next
      </button>
    </div>
  );

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
      ) : data ? (
        <>
          {renderAllProfilesDetails()}
          {renderPaginationControls()}
        </>
      ) : (
        <p>There are no profiles to display</p>
      )}
    </>
  );
}

export default AllProfiles;
