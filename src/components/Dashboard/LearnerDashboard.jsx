import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LearnerDashboard() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [assignedAdvisors, setAssignedAdvisors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAssignedAdvisors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profiles/assigned/advisors`, {
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

        setAssignedAdvisors(result.data.assigned);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAssignedAdvisors();
  }, [accessToken]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <>
          <p>
            {assignedAdvisors
              ? `Your mentor is ${assignedAdvisors?.mentor?.name?.first}`
              : "Your mentor will be assigned soon"}
          </p>
          <p>
            {assignedAdvisors
              ? `Your coach is ${assignedAdvisors?.coach?.name?.first}`
              : "Your coach will be assigned soon"}
          </p>
        </>
      )}
    </div>
  );
}

export default LearnerDashboard;
