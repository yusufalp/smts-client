import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LearnerDashboard() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [assignedAdvisors, setAssignedAdvisors] = useState({});

  useEffect(() => {
    const getAssignedAdvisors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profiles/advisors`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        console.log("result :>> ", result);

        if (result.error) {
          throw new Error(result.error.message);
        }

        setAssignedAdvisors(result.data.assigned);
      } catch (error) {
        console.log(error);
      }
    };

    getAssignedAdvisors();
  }, [accessToken]);

  return (
    <div>
      <p>
        Your mentor is{" "}
        {assignedAdvisors?.mentor?.name?.first || "will be assigned soon"}
      </p>
      <p>
        Your coach is{" "}
        {assignedAdvisors?.coach?.name?.first || "will be assigned soon"}
      </p>
    </div>
  );
}

export default LearnerDashboard;
