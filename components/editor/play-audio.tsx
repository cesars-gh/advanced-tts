'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayAudioProps {
  url?: string;
  isGenerating?: boolean;
  onGenerate?: () => Promise<void>;
  playOnMount?: boolean;
}

export function PlayAudio({
  url,
  isGenerating = false,
  onGenerate,
  playOnMount = false,
}: PlayAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** Initialize Audio object when URL changes **/
  useEffect(() => {
    if (url) {
      audioRef.current = new Audio(url);

      // Event listeners for audio
      const handleError = (error: ErrorEvent) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);

      // Play audio on mount if playOnMount is true
      if (playOnMount) {
        setIsPlaying(true);
        audioRef.current.play();
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [url, playOnMount]);

  const handlePlay = async () => {
    if (isGenerating) {
      return;
    }

    // Empty URL: Generate audio
    if (!url && onGenerate) {
      await onGenerate();
      return;
    }

    // Ready: Play audio from the beginning
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    // Playing: Pause audio
    else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const getButtonIcon = () => {
    if (isGenerating) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (isPlaying) return <PauseCircle className="h-5 w-5" />;
    return <PlayCircle className="h-5 w-5" />;
  };

  return (
    <Button
      variant={!url ? 'secondary' : 'default'}
      disabled={isGenerating}
      onClick={handlePlay}
      className={cn('transition-colors', url && 'bg-green-600 hover:bg-green-700 text-white')}
    >
      {getButtonIcon()}
    </Button>
  );
}
