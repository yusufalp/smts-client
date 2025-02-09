import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { constructUrl } from "../../utils/url";

function Meeting() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { meetingId } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getMeeting = async () => {
      const baseUrl = import.meta.env.VITE_MEETING_SERVICE_URL;
      const endpoint = "/api/meetings/:meetingId";
      const params = { meetingId };

      const url = constructUrl(baseUrl, endpoint, params);

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
          throw new Error(result.error.message || "Failed to get meeting.");
        }

        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getMeeting();
  }, [accessToken, meetingId]);

  const renderMeetingDetails = () => {
    const { meeting } = data;
    
    return (
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
    );
  };

  return (
    <main>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data ? (
        <>{renderMeetingDetails()}</>
      ) : (
        <p>There is no meeting</p>
      )}
    </main>
  );
}

export default Meeting;
