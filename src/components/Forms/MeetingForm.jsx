import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MeetingForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [meetingFormData, setMeetingFormData] = useState({
    title: "",
    advisor: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });
  const [advisors, setAdvisors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllAdvisors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profiles?role=advisor&field=name`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (result.error) {
          throw new Error("Error when getting advisors");
        }

        setAdvisors(result.data.profiles);
      } catch (error) {
        console.log(error);
      }
    };

    getAllAdvisors()
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings`, {
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
      console.log(error);
    }
  };

  return (
    <main className="meeting">
      <form onSubmit={handleFormSubmit}>
        <h1>Add meeting</h1>
        <p className="text-margin-0">Did you just meet with your mentor or coach?</p>
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
          name="advisor"
          id="advisor"
          defaultValue="default"
          required
          onChange={handleMeetingInputChange}
        >
          <option value="default" disabled>
            Select your advisor
          </option>
          {advisors && advisors.map((advisor) => (
            <option key={advisor._id} value={advisor._id}>
              {advisor.name.first}
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
        <button type="submit">Submit</button>
        <Link to="/dashboard">Cancel</Link>
      </form>
    </main>
  );
}

export default MeetingForm;
