import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PAGINATION } from "../../constants/pagination";

const MEETING_SERVICE_URL = import.meta.env.VITE_MEETING_SERVICE_URL;

function AllMeetings() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [meetings, setMeetings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState({
    title: "",
    date: "",
    organizer: "",
    page: PAGINATION.PAGE.value,
    limit: PAGINATION.SIZE.value,
  });

  const { role } = profile;

  useEffect(() => {
    const getAllMeetings = async () => {
      const url = new URL(`${MEETING_SERVICE_URL}/api/admin/meetings`);

      Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      // TODO: update search parameters and call API 3 seconds after the type is complete

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

        setMeetings(result.data.meetings);
        setTotalPages(result.data.pagination.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const applyFilter = setTimeout(() => {
      getAllMeetings();
    }, 1000);

    return () => clearTimeout(applyFilter);
  }, [accessToken, role, query]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

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
      ) : meetings.length === 0 ? (
        <p>There are no meetings to display</p>
      ) : (
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
              <li>{meeting.title}</li>
              <li>{new Date(meeting.scheduledAt).toLocaleDateString()}</li>
              <li>{new Date(meeting.scheduledAt).toLocaleTimeString()}</li>
              <li>{meeting.durationMinutes}</li>
              <li>{meeting.organizer.name.firstName}</li>
            </ul>
          ))}
        </>
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
            Page {query.page} of {totalPages}
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

export default AllMeetings;
