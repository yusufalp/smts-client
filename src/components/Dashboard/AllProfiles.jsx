import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { PAGINATION_VALUES } from "../../constants/paginationValues";

const API_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AllProfiles() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [profiles, setProfiles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState({
    status: "active",
    role: "all",
    page: PAGINATION_VALUES.PAGE.value,
    limit: PAGINATION_VALUES.SIZE.value,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getAllProfiles = async () => {
      const url = new URL(`${API_SERVER_URL}/api/admin/profiles`);

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
      <h1>All Profiles</h1>

      <div>
        <label htmlFor="status">Status: </label>
        <select
          name="status"
          id="status"
          value={query.status}
          onChange={(e) => updateQuery({ status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
        </select>

        <label htmlFor="role">Role:</label>
        <select
          name="role"
          id="role"
          value={query.role}
          onChange={(e) => updateQuery({ role: e.target.value })}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="mentor">Mentor</option>
          <option value="coach">Coach</option>
          <option value="mentee">Mentee</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
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
    </>
  );
}

export default AllProfiles;
