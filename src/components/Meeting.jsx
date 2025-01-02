import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MEETING_SERVICE_URL = import.meta.env.VITE_MEETING_SERVICE_URL;

function Meeting() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { meetingId } = useParams();

  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getMeeting = async () => {
      try {
        const response = await fetch(
          `${MEETING_SERVICE_URL}/api/meetings/${meetingId}`,
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
          <p>
            Organizer: {meeting.organizer?.name?.firstName}{" "}
            {meeting.organizer?.name?.lastName}
          </p>
          <p>Participants:</p>
          <ul>
            {meeting &&
              meeting.participants.map((participant) => (
                <li key={participant._id}>
                  {participant.name.firstName} {participant.name.lastName}
                </li>
              ))}
          </ul>
          <p>Description</p>
          <p>{meeting.description}</p>
          <p>Date: {new Date(meeting.scheduledAt).toLocaleDateString()}</p>
          <p>Time: {new Date(meeting.scheduledAt).toLocaleTimeString()}</p>
          <p>Duration: {meeting.durationMinutes} min</p>
          <p>Summary: {meeting.summary || "Summary are not recorded"}</p>
        </>
      )}
    </main>
  );
}

export default Meeting;
