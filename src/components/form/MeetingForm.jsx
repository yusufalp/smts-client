import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { constructUrl } from "../../utils/url";

function MeetingForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [meetingFormData, setMeetingFormData] = useState({
    title: "",
    advisor: "",
    date: "",
    time: "",
    duration: 30,
    description: "",
  });

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllAdvisors = async () => {
      const serviceBaseUrl = import.meta.env.VITE_PROFILE_SERVICE_URL;
      const serviceEndpoint = "/api/profiles/advisors";

      const serviceUrl = constructUrl(serviceBaseUrl, serviceEndpoint);

      const serviceOptions = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await fetch(serviceUrl, serviceOptions);

        const result = await response.json();

        if (result.error || !response.ok) {
          throw new Error(
            result.error.message || "Error when getting advisors"
          );
        }

        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllAdvisors();
  }, [accessToken]);

  const handleInputChange = (e) => {
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

    const selectedAdvisor = data.advisors.find(
      (advisor) => (advisor._id = meetingFormData.advisor)
    );

    const payload = {
      ...meetingFormData,
      organizer: {
        profileId: profile._id,
        email: profile.email,
        name: profile.name,
      },
      advisor: {
        profileId: selectedAdvisor._id,
        email: selectedAdvisor.email,
        name: selectedAdvisor.name,
      },
    };

    const meetingBaseUrl = import.meta.env.VITE_MEETING_SERVICE_URL;
    const meetingEndpoint = "/api/meetings";

    const meetingUrl = constructUrl(meetingBaseUrl, meetingEndpoint);

    const meetingOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(meetingUrl, meetingOptions);

      const result = await response.json();

      if (result.error || !response.ok) {
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
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : data ? (
        <form onSubmit={handleFormSubmit}>
          <h1>Add meeting</h1>
          <p className="text-margin-0">
            Did you just meet with your mentor or coach?
          </p>
          <p className="text-margin-0">Complete the form</p>

          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Add a short title"
              value={meetingFormData.title}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="advisor">Advisor</label>
            <select
              id="advisor"
              name="advisor"
              defaultValue="default"
              required
              onChange={handleInputChange}
            >
              <option value="default" disabled>
                Select your advisor
              </option>
              {data &&
                data.advisors.map((advisor) => (
                  <option key={advisor._id} value={advisor._id}>
                    {advisor.name.firstName} {advisor.name.lastName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={meetingFormData.date}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={meetingFormData.time}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="duration">Duration (min)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              required
              value={meetingFormData.duration}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows={4}
              cols={40}
              placeholder="Enter description here..."
              value={meetingFormData.description}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <Link to="/dashboard">Cancel</Link>
        </form>
      ) : (
        <p>There are no advisors</p>
      )}
    </>
  );
}

export default MeetingForm;
