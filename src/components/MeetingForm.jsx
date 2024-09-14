import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { mentors } from "../data/mentors";

function MeetingForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [meetingFormData, setMeetingFormData] = useState({
    title: "",
    mentorId: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });

  const navigate = useNavigate();

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;

    setMeetingFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/meetings", {
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
        <p className="text-margin-0">Did you just meet with your mentor?</p>
        <p className="text-margin-0">Complete the form</p>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Short title"
          value={meetingFormData.title}
          onChange={handleFormDataChange}
        />
        <label htmlFor="mentorId">Mentor</label>
        <select
          name="mentorId"
          id="mentorId"
          defaultValue="default"
          required
          onChange={handleFormDataChange}
        >
          <option value="default" disabled>
            Select your mentor
          </option>
          {mentors.map((mentor) => (
            <option key={mentor._id} value={mentor._id}>
              {mentor.name.first}
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
          onChange={handleFormDataChange}
        />
        <label htmlFor="time">Time</label>
        <input
          type="time"
          id="time"
          name="time"
          required
          value={meetingFormData.time}
          onChange={handleFormDataChange}
        />
        <label htmlFor="duration">Duration (min)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          required
          value={meetingFormData.duration}
          onChange={handleFormDataChange}
        />
        <label htmlFor="noes">Notes about the meeting</label>
        <textarea
          name="notes"
          id="notes"
          rows={4}
          cols={40}
          placeholder="Enter important notes here..."
          value={meetingFormData.notes}
          onChange={handleFormDataChange}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

export default MeetingForm;
