'use client';

import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceItem } from './VoiceItem';
import type { Voice } from '@/lib/types/voice.type';

interface VoiceListProps {
  voices: Voice[];
  onEdit: (voice: Voice) => void;
  onDelete: (id: number) => Promise<void>;
  onCreateNew: () => void;
  loading?: boolean;
}

export function VoiceList({ voices, onEdit, onDelete, onCreateNew, loading = false }: VoiceListProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <p>Loading voices...</p>
      </div>
    );
  }

  if (voices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
        <Mic className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No voices found</h3>
        <p className="text-muted-foreground mb-4">Create your first voice to get started.</p>
        <Button onClick={onCreateNew}>Create Voice</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 items-start">
      {voices.map((voice) => (
        <VoiceItem key={voice.id} voice={voice} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
