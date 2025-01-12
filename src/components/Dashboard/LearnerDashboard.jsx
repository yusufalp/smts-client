import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import MeetingList from "../shared/MeetingList";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function LearnerDashboard({ name }) {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [assignedAdvisors, setAssignedAdvisors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAssignedAdvisors = async () => {
      try {
        const response = await fetch(
          `${PROFILE_SERVICE_URL}/api/profiles/assigned/advisors`,
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

        setAssignedAdvisors(result.data.advisors.assigned);
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
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <main>
          <h1>Welcome {name.firstName}</h1>
          {renderAdvisorInfo("mentor", assignedAdvisors?.mentor)}
          {renderAdvisorInfo("coach", assignedAdvisors?.coach)}
          <MeetingList />
        </main>
      )}
    </>
  );
}

LearnerDashboard.propTypes = {
  name: PropTypes.object,
};

export default LearnerDashboard;
