import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;
const MEETING_SERVICE_URL = import.meta.env.VITE_MEETING_SERVICE_URL;

function MeetingForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [meetingFormData, setMeetingFormData] = useState({
    title: "",
    advisor: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });
  const [advisors, setAdvisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllAdvisors = async () => {
      try {
        const response = await fetch(
          `${PROFILE_SERVICE_URL}/api/profiles/advisors`,
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
          throw new Error("Error when getting advisors");
        }

        setAdvisors(result.data.advisors);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllAdvisors();
  }, [accessToken]);

  const handleMeetingInputChange = (e) => {
    const { name, value } = e.target;

    setMeetingFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    meetingFormData.learner = profile._id;

    try {
      const response = await fetch(`${MEETING_SERVICE_URL}/api/meetings`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(meetingFormData),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="meeting">
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <form onSubmit={handleFormSubmit}>
          <h1>Add meeting</h1>
          <p className="text-margin-0">
            Did you just meet with your mentor or coach?
          </p>
          <p className="text-margin-0">Complete the form</p>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Add a short title"
            value={meetingFormData.title}
            onChange={handleMeetingInputChange}
          />
          <label htmlFor="advisor">Advisor</label>
          <select
            id="advisor"
            name="advisor"
            defaultValue="default"
            required
            onChange={handleMeetingInputChange}
          >
            <option value="default" disabled>
              Select your advisor
            </option>
            {advisors &&
              advisors.map((advisor) => (
                <option key={advisor._id} value={advisor._id}>
                  {advisor.name.firstName} {advisor.name.lastName}
                </option>
              ))}
          </select>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={meetingFormData.date}
            onChange={handleMeetingInputChange}
          />
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            required
            value={meetingFormData.time}
            onChange={handleMeetingInputChange}
          />
          <label htmlFor="duration">Duration (min)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            required
            value={meetingFormData.duration}
            onChange={handleMeetingInputChange}
          />
          <label htmlFor="noes">Notes about the meeting</label>
          <textarea
            name="notes"
            id="notes"
            rows={4}
            cols={40}
            required
            placeholder="Enter important notes here..."
            value={meetingFormData.notes}
            onChange={handleMeetingInputChange}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting" : "Submit"}
          </button>
          <Link to="/dashboard">Cancel</Link>
        </form>
      )}
    </main>
  );
}

export default MeetingForm;
