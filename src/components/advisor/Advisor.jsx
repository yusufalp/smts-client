import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { constructUrl } from "../../utils/url";

function Advisor() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { advisorId } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAdvisor = async () => {
      setError(null);
      setIsLoading(true);

      const baseUrl = import.meta.env.VITE_PROFILE_SERVICE_URL;
      const endpoint = "/api/admin/profiles/:advisorId";
      const params = { advisorId };
      const query = {};

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
          throw new Error(result.error.message || "Failed to get advisor");
        }

        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAdvisor();
  }, [accessToken, advisorId]);

  return (
    <main>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data ? (
        <>
          <h1>{`You are viewing ${data.profile?.name?.firstName}'s Profile`}</h1>
        </>
      ) : (
        <p>There is no advisor</p>
      )}
    </main>
  );
}

export default Advisor;
