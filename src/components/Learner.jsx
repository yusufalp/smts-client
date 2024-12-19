import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const API_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Learner() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { menteeId } = useParams();

  const [mentee, setMentee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getLearner = async () => {
      try {
        const response = await fetch(
          `${API_SERVER_URL}/api/profiles/assigned/mentee/${menteeId}`,
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

        setMentee(result.data.mentee);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getLearner();
  }, [accessToken, menteeId]);

  return (
    <main>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && mentee && (
        <>
          <h1>{`You are viewing ${mentee?.name?.first}'s Profile`}</h1>
          <p>Email: {mentee?.email}</p>
          <p>Cohort: {mentee?.cohort}</p>
          <p>Graduation: {mentee?.graduation}</p>
          <p>Status: {mentee?.status}</p>
          {mentee.links && (
            <>
              <h2>Links</h2>
              <ul>
                <li>
                  <Link
                    to={mentee?.links?.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to={mentee?.links?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    to={mentee?.links?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </>
          )}
        </>
      )}
    </main>
  );
}

export default Learner;
