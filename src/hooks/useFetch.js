import { useCallback, useState } from "react";
import { constructUrl } from "../utils/url";

export function useFetch({
  baseUrl = "",
  endpoint = "",
  params = {},
  query = {},
  method = "GET",
  credentials = "include",
  headers = {},
  body = null,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = constructUrl(baseUrl, endpoint, params, query);

      const options = {
        method,
        credentials,
        headers,
        body: body ? JSON.stringify(body) : null,
      };

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      setData(result.data);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, endpoint, JSON.stringify(params), JSON.stringify(query), method, credentials, JSON.stringify(headers), JSON.stringify(body)]);

  return { data, error, loading, fetchData };
}
