import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { STATUSES } from "../../constants/statuses";
import { PAGINATION } from "../../constants/pagination";

import { constructUrl } from "../../utils/url";

function LearnerList() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState({
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  useEffect(() => {
    const getAllAssignedLearners = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_SERVER_SERVICE_URL;
      const endpoint = "/api/profiles/assigned/learners";
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
          throw new Error(result.error.message || "Failed to get learners.");
        }

        setData(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllAssignedLearners();
  }, [accessToken, query]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  const renderLearnersDetails = () => (
    <div className="data-list">
      <ul>
        <li>First Name</li>
        <li>Last Name</li>
        <li>Graduation</li>
        <li>Status</li>
      </ul>
      {data.learners.map((learner) => (
        <ul key={learner._id}>
          <li>
            <Link to={`/learner/${learner._id}`}>{learner.name.firstName}</Link>
          </li>
          <li>{learner.name.lastName}</li>
          <li>{new Date(learner.graduationDate).toLocaleDateString()}</li>
          <li>{STATUSES[learner.status].id}</li>
        </ul>
      ))}
    </div>
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
      <h2>Learners</h2>

      <div className="divider"></div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data.learners.length !== 0 ? (
        <>
          <>{renderLearnersDetails()}</>
          <>{renderPaginationControls()}</>
        </>
      ) : (
        <p>There are no learners assigned</p>
      )}
    </>
  );
}

export default LearnerList;
