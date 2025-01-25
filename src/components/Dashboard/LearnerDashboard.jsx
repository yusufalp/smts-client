import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import MeetingList from "../meeting/MeetingList";

import { constructUrl } from "../../utils/url";

function LearnerDashboard() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAssignedAdvisors = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_PROFILE_SERVICE_URL;
      const endpoint = "/api/profiles/assigned/advisors";

      const url = constructUrl(baseUrl, endpoint);

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
          throw new Error(result.error.message || "Failed to get advisors");
        }

        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAssignedAdvisors();
  }, [accessToken]);

  const renderAdvisorInfo = (advisorRole, advisor) => {
    return (
      <p>
        {`Your ${advisorRole} ${
          advisor ? `is ${advisor?.name?.firstName}` : "will be assigned soon"
        }`}
      </p>
    );
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data ? (
        <>
          <div className="learner-dashboard">
            {renderAdvisorInfo("mentor", data.advisors?.assigned?.mentor)}
            {renderAdvisorInfo("coach", data.advisors?.assigned?.coach)}
          </div>
          <div className="meetings-list-dashboard">
            <MeetingList />
          </div>
        </>
      ) : (
        <p>There are no advisors</p>
      )}
    </>
  );
}

export default LearnerDashboard;
