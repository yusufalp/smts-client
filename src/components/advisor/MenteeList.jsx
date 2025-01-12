import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { STATUSES } from "../../constants/statuses";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function MenteeList() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [assignedLearners, setAssignedLearners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAssignedLearners = async () => {
      try {
        const response = await fetch(
          `${PROFILE_SERVICE_URL}/api/profiles/assigned/learners`,
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

        setAssignedLearners(result.data.learners);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAssignedLearners();
  }, [accessToken]);

  const menteeList = useMemo(
    () =>
      assignedLearners.map((mentee) => (
        <ul key={mentee._id}>
          <li>
            <Link to={`/learner/${mentee._id}`}>{mentee.name.firstName}</Link>
          </li>
          <li>{mentee.name.lastName}</li>
          <li>{new Date(mentee.graduationDate).toLocaleDateString()}</li>
          <li>{STATUSES[mentee.profileStatus].id}</li>
        </ul>
      )),
    [assignedLearners]
  );

  return (
    <>
      <h2>Mentees</h2>

      {isLoading && <p>Loading</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && assignedLearners.length ? (
        <>
          <ul>
            <li>First Name</li>
            <li>Last Name</li>
            <li>Graduation</li>
            <li>Status</li>
          </ul>
          {menteeList}
        </>
      ) : (
        !isLoading && !error && <p>There are no mentees assigned yet</p>
      )}
    </>
  );
}

export default MenteeList;
