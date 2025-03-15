
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language/LanguageContext';

/**
 * A custom hook that fetches data and automatically translates it
 * before returning it to the component
 */
export function useTranslatedData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { translateData } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the data using the provided function
        const result = await fetchFn();
        
        // Automatically translate the data based on user's language
        const translatedResult = await translateData(result);
        
        setData(translatedResult);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error };
}
