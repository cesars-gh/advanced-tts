'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import type { Voice } from '@/lib/types/voice.type';
import { DeleteVoiceDialog } from './DeleteVoiceDialog';

interface VoiceItemProps {
  voice: Voice;
  onEdit: (voice: Voice) => void;
  onDelete: (id: number) => Promise<void>;
}

export function VoiceItem({ voice, onEdit, onDelete }: VoiceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{voice.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(voice)}
              aria-label="Edit voice"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete voice"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="text-sm font-medium">Provider: </span>
            <span className="text-sm capitalize">{voice.provider}</span>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium">Prompt</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isExpanded && (
              <p className="text-sm whitespace-pre-wrap mt-2 p-3 bg-secondary/50 rounded-md">
                {voice.prompt}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteVoiceDialog
        voice={voice}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={onDelete}
      />
    </>
  );
}
