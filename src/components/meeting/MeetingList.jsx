import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { PAGINATION } from "../../constants/pagination";

import { useFetch } from "../../hooks/useFetch";

function MeetingList() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const navigate = useNavigate();

  const [query, setQuery] = useState({
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  const { data, error, loading, fetchData } = useFetch({
    baseUrl: import.meta.env.VITE_MEETING_SERVICE_URL,
    endpoint: "/api/meetings",
    query: { ...query, profileId: profile._id },
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

  const renderMeetingsDetails = () => (
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
          <li>{meeting.durationMinutes} minutes</li>
          <li>{meeting.organizer.name.firstName}</li>
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
      <h2>Meetings</h2>
      {profile.role === "mentee" && (
        <button onClick={() => navigate("/meeting-form")}>
          Add a New Meeting
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : data ? (
        <>
          {renderMeetingsDetails()}
          {renderPaginationControls()}
        </>
      ) : (
        <p>There are no meetings.</p>
      )}
    </>
  );
}

export default MeetingList;
