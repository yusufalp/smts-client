import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { constructUrl } from "../../utils/url";

function Learner() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { learnerId } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLearner = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_PROFILE_SERVICE_URL;
      const endpoint = "/api/profiles/assigned/learner/:learnerId";
      const params = { learnerId };

      const url = constructUrl(baseUrl, endpoint, params);

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
          throw new Error(result.error.message || "Failed to get learner.");
        }

        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getLearner();
  }, [accessToken, learnerId]);

  const renderLearnerDetails = () => {
    const { learner } = data;

    return (
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
    );
  };

  return (
    <main>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data ? (
        <>{renderLearnerDetails()}</>
      ) : (
        <p>There are no learners</p>
      )}
    </main>
  );
}

export default Learner;
