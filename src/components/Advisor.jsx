import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Advisor() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { advisorId } = useParams();

  const [advisor, setAdvisor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAdvisor = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/profiles/${advisorId}`,
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

        setAdvisor(result.data.profile);
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
      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && advisor && (
        <>
          <h1>{`You are viewing ${advisor?.name?.first}'s Profile`}</h1>
        </>
      )}
    </main>
  );
}

export default Advisor;
