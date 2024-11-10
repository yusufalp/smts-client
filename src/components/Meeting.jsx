import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Meeting() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userProfile = useSelector((state) => state.user.profile);

  const { meetingId } = useParams();

  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { role } = userProfile;

  const isLearner = role === "mentee" || role === "alumni";

  useEffect(() => {
    const getMeeting = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/meetings/${meetingId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error.message);
        }

        setMeeting(result.data.meeting);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMeeting();
  }, [accessToken, meetingId]);

  return (
    <main>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && meeting && (
        <>
          <h1>{meeting.title}</h1>
          {isLearner ? (
            <p>
              Advisor: <span>{meeting.advisor?.name?.first}</span>
            </p>
          ) : (
            <p>
              Learner:{" "}
              <Link to={`/mentee/${meeting.learner?._id}`}>
                {meeting.learner?.name?.first}
              </Link>
            </p>
          )}
          <p>Date: {new Date(meeting.date).toLocaleDateString()}</p>
          <p>Duration: {meeting.duration} min</p>
          <p>Notes: {meeting.notes || "Notes are not recorded"}</p>
        </>
      )}
    </main>
  );
}

export default Meeting;
