import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { STATUSES } from "../../constants/statuses";
import { PAGINATION } from "../../constants/pagination";

import { useFetch } from "../../hooks/useFetch";

function LearnerList() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [query, setQuery] = useState({
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  const { data, error, loading, fetchData } = useFetch({
    baseUrl: import.meta.env.VITE_PROFILE_SERVICE_URL,
    endpoint: "/api/profiles/assigned/learners",
    query,
    method: "GET",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  const renderLearnersDetails = () =>
    data.learners.map((learner) => (
      <>
        <ul>
          <li>First Name</li>
          <li>Last Name</li>
          <li>Graduation</li>
          <li>Status</li>
        </ul>

        <ul key={learner._id}>
          <li>
            <Link to={`/learner/${learner._id}`}>{learner.name.firstName}</Link>
          </li>
          <li>{learner.name.lastName}</li>
          <li>{new Date(learner.graduationDate).toLocaleDateString()}</li>
          <li>{STATUSES[learner.profileStatus].id}</li>
        </ul>
      </>
    ));

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

      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data ? (
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
