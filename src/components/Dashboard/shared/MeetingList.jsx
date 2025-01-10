import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { PAGINATION } from "../../../constants/pagination";

const MEETING_SERVICE_URL = import.meta.env.VITE_MEETING_SERVICE_URL;

function MeetingList() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  const navigate = useNavigate();

  const { role, _id } = profile;

  useEffect(() => {
    const getMeetings = async () => {
      const url = new URL(`${MEETING_SERVICE_URL}/api/meetings`);

      url.searchParams.append("profileId", _id);

      Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      try {
        const response = await fetch(url, {
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

        setMeetings(result.data.meetings);
        setTotalPages(result.data.pagination.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMeetings();
  }, [_id, accessToken, query, role]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <h2>Meetings</h2>

      {role === "mentee" && (
        <button onClick={() => navigate("/meeting-form")}>
          Add a new meeting
        </button>
      )}

      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && meetings.length ? (
        <>
          <ul>
            <li>Title</li>
            <li>Date</li>
            <li>Time</li>
            <li>Duration</li>
            <li>Organizer</li>
          </ul>
          {meetings.map((meeting) => (
            <ul key={meeting._id}>
              <li>
                <Link to={`/meeting/${meeting._id}`}>{meeting.title}</Link>
              </li>
              <li>{new Date(meeting.scheduledAt).toLocaleDateString()}</li>
              <li>{new Date(meeting.scheduledAt).toLocaleTimeString()}</li>
              <li>{meeting.durationMinutes}</li>
              <li>{meeting.organizer.name.firstName}</li>
            </ul>
          ))}
        </>
      ) : (
        !isLoading && !error && <p>There are no meetings</p>
      )}

      {meetings.length > 0 && (
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

export default MeetingList;
