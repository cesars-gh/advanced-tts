'use client';

import Link from 'next/link';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TextScript } from '@/lib/types/script.type';

interface ScriptCardProps {
  script: TextScript;
  onDelete: () => void;
  onEdit: () => void;
}

export function ScriptCard({ script, onDelete, onEdit }: ScriptCardProps) {
  return (
    <div className="relative border p-4 rounded-lg hover:bg-secondary/50 transition-colors group">
      <Link href={`/scripts/${script.id}`} className="block">
        <h3 className="font-medium text-lg">{script.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{script.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{script.sections.length} sections</span>
        </div>
      </Link>

      <div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        role="presentation"
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:text-primary mr-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit script</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete script</span>
        </Button>
      </div>
    </div>
  );
}
