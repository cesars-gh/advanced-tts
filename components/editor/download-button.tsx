import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface DownloadAllProps {
  onDownload: () => Promise<void>;
  className?: string;
  disabled?: boolean;
}

export function DownloadAll({ onDownload, className = '', disabled = false }: DownloadAllProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      await onDownload();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isLoading || disabled} className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        'Download All'
      )}
    </Button>
  );
}
