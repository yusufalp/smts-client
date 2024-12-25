import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

function Learner() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { learnerId } = useParams();

  const [learner, setLearner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getLearner = async () => {
      try {
        const response = await fetch(
          `${PROFILE_SERVICE_URL}/api/profiles/assigned/learner/${learnerId}`,
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

        setLearner(result.data.learner);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getLearner();
  }, [accessToken, learnerId]);

  return (
    <main>
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && learner && (
        <>
          <h1>{`You are viewing ${learner?.name?.firstName}'s Profile`}</h1>
          <p>Email: {learner?.email}</p>
          <p>Cohort: {learner?.cohort}</p>
          <p>Graduation: {learner?.graduationDate}</p>
          <p>Status: {learner?.status}</p>
          {learner.links && (
            <>
              <h2>Links</h2>
              <ul>
                <li>
                  <Link
                    to={learner?.links?.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to={learner?.links?.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    to={learner?.links?.githubUrl}
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
