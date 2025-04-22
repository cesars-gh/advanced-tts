import type { Voice } from '@/lib/types/voice.type';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/** Fetch voices from the database */
export const useFetchVoices = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voices');
        const data = (await response.json()) as Voice[];
        setVoices(data);
      } catch (error) {
        console.error('Failed to fetch voices:', error);
        toast.error('Failed to fetch voices');
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  return { voices, loading };
};
