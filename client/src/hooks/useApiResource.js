import { useCallback, useEffect, useState } from "react";








export function useApiResource(
request,
fallbackData)
{
  const [data, setData] = useState(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextData = await request();
      setData(nextData);
    } catch (err) {
      setData(fallbackData);
      setError(err instanceof Error ? err.message : "Unable to load live data.");
    } finally {
      setIsLoading(false);
    }
  }, [fallbackData, request]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    isLoading,
    error,
    refetch: load
  };
}