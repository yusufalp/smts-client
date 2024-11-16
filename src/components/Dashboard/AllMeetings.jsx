import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PAGINATION_VALUES } from "../../constants/paginationValues";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AllMeetings() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [meetings, setMeetings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState({
    learner: "",
    advisor: "",
    date: "",
    page: PAGINATION_VALUES.PAGE.value,
    limit: PAGINATION_VALUES.SIZE.value,
  });

  useEffect(() => {
    const getAllMeetings = async () => {
      const url = new URL(`${API_BASE_URL}/api/admin/meetings`);

      Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      console.log("url :>> ", url);
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

    getAllMeetings();
  }, [accessToken, query]);

  const updateQuery = (updates) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <h1>All Meetings</h1>
      
      <div>
        <label htmlFor="learner">Learner</label>
        <input
          type="text"
          name="learner"
          id="learner"
          value={query.learner}
          onChange={(e) => updateQuery({ learner: e.target.value })}
        />
        <label htmlFor="advisor">Advisor</label>
        <input
          type="text"
          name="advisor"
          id="advisor"
          value={query.advisor}
          onChange={(e) => updateQuery({ advisor: e.target.value })}
        />
        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          value={query.date}
          onChange={(e) => updateQuery({ date: e.target.value })}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <ul>
            <li>Title</li>
            <li>Date</li>
            <li>Time</li>
            <li>Duration</li>
            <li>Advisor</li>
            <li>Learner</li>
          </ul>
          {meetings &&
            meetings.map((meeting) => (
              <ul key={meeting._id}>
                <li>{meeting.title}</li>
                <li>{new Date(meeting.date).toLocaleDateString()}</li>
                <li>{new Date(meeting.date).toLocaleTimeString()}</li>
                <li>{meeting.duration}</li>
                <li>{meeting.advisor.name.first}</li>
                <li>{meeting.learner.name.first}</li>
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

export default AllMeetings;
