import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MeetingList() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [meetings, setMeetings] = useState([]);

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
        console.log(error);
      }
    };

    getMeetings();
  }, [accessToken]);

  return (
    <>
      {meetings.length ? (
        <>
          <ul>
            <li>Title</li>
            <li>Date</li>
            <li>Time</li>
            <li>Duration</li>
            <li>With</li>
          </ul>
          {meetings.map((meeting) => (
            <ul key={meeting._id}>
              <li>{meeting.title}</li>
              {/* Update the date format */}
              <li>{meeting.date}</li>
              <li>{meeting.time}</li>
              <li>{meeting.duration}</li>
              {/* TODO: render who the meeting was with */}
              <li></li>
            </ul>
          ))}
        </>
      ) : (
        <p>There are no meetings</p>
      )}
    </>
  );
}

export default MeetingList;
