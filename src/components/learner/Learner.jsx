import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { constructUrl } from "../../utils/url";
import ProfileDetails from "../profile/ProfileDetails";

function Learner() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

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
      const query = { advisorId: profile._id };

      const url = constructUrl(baseUrl, endpoint, params, query);

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

  return (
    <main>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data ? (
        <ProfileDetails profile={data.learner} />
      ) : (
        <p>There are no learners</p>
      )}
    </main>
  );
}

export default Learner;
