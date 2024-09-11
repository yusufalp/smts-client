import { useState } from "react";

import { mentors } from "../data/mentors";

function MeetingForm() {
  const [meetingFormData, setMeetingFormData] = useState({
    title: "",
    mentorId: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;

    setMeetingFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log("meetingFormData :>> ", meetingFormData);

  return (
    <main className="meeting">
      <form>
        <h1>Add meeting</h1>
        <p>Did you just meet with your mentor?</p>
        <p>Complete the form</p>
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
