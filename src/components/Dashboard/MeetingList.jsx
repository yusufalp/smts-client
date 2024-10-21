import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MeetingList() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userProfile = useSelector((state) => state.user.profile);

  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { role } = userProfile;

  useEffect(() => {
    const getMeetings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/meetings`, {
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
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMeetings();
  }, [accessToken, role]);

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
            <li>Participant</li>
          </ul>
          {meetings.map((meeting) => (
            <ul key={meeting._id}>
              <li>
                <Link to={`/meeting/${meeting._id}`}>{meeting.title}</Link>
              </li>
              <li>{new Date(meeting.date).toLocaleDateString()}</li>
              <li>{new Date(meeting.date).toLocaleTimeString()}</li>
              <li>{meeting.duration}</li>
              <li>
                {role === "mentor" && meeting.learner?.name?.first}
                {role === "mentee" && meeting.advisor?.name?.first}
              </li>
            </ul>
          ))}
        </>
      ) : (
        !isLoading && !error && <p>There are no meetings</p>
      )}
    </>
  );
}

export default MeetingList;
