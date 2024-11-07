import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AllMeetings() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [meetings, setMeetings] = useState([]);

  const [learner, setLearner] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [date, setDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAllMeetings = async () => {
      const url = new URL(`${API_BASE_URL}/api/admin/meetings`);

      if (learner) url.searchParams.append("learner", learner);
      if (advisor) url.searchParams.append("advisor", advisor);
      if (date) url.searchParams.append("date", date);

      try {
        const response = await fetch(url.toString(), {
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
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllMeetings();
  }, [accessToken, advisor, date, learner]);

  return (
    <>
      {isLoading && <p> Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <>
          <h1>All Meetings</h1>
          <div>
            <label htmlFor="learner">Learner</label>
            <input
              type="text"
              name="learner"
              id="learner"
              onChange={(e) => setLearner(e.target.value)}
            />
            <label htmlFor="advisor">Advisor</label>
            <input
              type="text"
              name="advisor"
              id="advisor"
              onChange={(e) => setAdvisor(e.target.value)}
            />
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <ul>
            {meetings &&
              meetings.map((meeting) => (
                <li key={meeting._id}>{meeting._id}</li>
              ))}
          </ul>
        </>
      )}
    </>
  );
}

export default AllMeetings;
