import type { TextScript } from '@/lib/types/script.type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseScriptReturn {
  script: TextScript | null;
  loading: boolean;
  error: string | null;
}

/** Fetch script data from the database */
export const useFetchScriptData = (scriptId: string): UseScriptReturn => {
  const [script, setScript] = useState<TextScript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await fetch(`/api/scripts/${scriptId}`);

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/scripts');
            return;
          }
          throw new Error(`Failed to fetch script: ${response.statusText}`);
        }

        const data = (await response.json()) as TextScript;
        setScript(data);
      } catch (error) {
        console.error('Failed to load script:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [scriptId, router]);

  return { script, loading, error };
};
