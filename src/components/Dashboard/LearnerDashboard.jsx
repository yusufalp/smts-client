import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function LearnerDashboard() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [assignedRoles, setAssignedRoles] = useState(null);
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

        setAssignedRoles(result.data.assignedRoles);
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
          advisor ? `is ${advisor?.name?.first}` : "will be assigned soon"
        }`}
      </p>
    );
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <>
          {renderAdvisorInfo("mentor", assignedRoles?.mentor)}
          {renderAdvisorInfo("coach", assignedRoles?.coach)}
        </>
      )}
    </>
  );
}

export default LearnerDashboard;
