import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { PAGINATION } from "../../constants/pagination";

import { constructUrl } from "../../utils/url";

function AllMeetings() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState({
    title: "",
    date: "",
    organizer: "",
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  useEffect(() => {
    const getAllMeetings = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_MEETING_SERVICE_URL;
      const endpoint = "/api/admin/meetings";
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
          throw new Error(result.error.message || "Failed to get meetings.");
        }

        setData(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const applyFilter = setTimeout(() => {
      getAllMeetings();
    }, 1000);

    return () => clearTimeout(applyFilter);
  }, [accessToken, query]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  const renderAllMeetingsDetails = () => (
    <>
      <ul>
        <li>Title</li>
        <li>Date</li>
        <li>Time</li>
        <li>Duration</li>
        <li>Organizer</li>
      </ul>
      {data.meetings.map((meeting) => (
        <ul key={meeting._id}>
          <li>
            <Link to={`/meeting/${meeting._id}`}>{meeting.title}</Link>
          </li>
          <li>{new Date(meeting.scheduledAt).toLocaleDateString()}</li>
          <li>{new Date(meeting.scheduledAt).toLocaleTimeString()}</li>
          <li>{meeting.durationMinutes}</li>
          <li>
            <Link to={`/learner/${meeting.organizer.profileId}`}>
              {meeting.organizer.name.firstName}
            </Link>
          </li>
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
      <h1>All Meetings</h1>

      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={query.title}
          onChange={(e) => updateQuery({ title: e.target.value })}
        />

        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          value={query.date}
          onChange={(e) => updateQuery({ date: e.target.value })}
        />

        <label htmlFor="organizer">Organizer</label>
        <input
          type="text"
          name="organizer"
          id="organizer"
          value={query.organizer}
          onChange={(e) => updateQuery({ organizer: e.target.value })}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : data ? (
        <>
          {renderAllMeetingsDetails()}
          {renderPaginationControls()}
        </>
      ) : (
        <p>There are no meetings to display</p>
      )}
    </>
  );
}

export default AllMeetings;
