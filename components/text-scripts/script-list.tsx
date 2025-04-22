'use client';

import Link from 'next/link';
import { FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScriptCard } from '@/components/text-scripts/script-card';
import type { TextScript } from '@/lib/types/script.type';

interface ScriptListProps {
  scripts: TextScript[];
  loading: boolean;
  onDeleteScript: (scriptId: string) => void;
  onEditScript: (script: TextScript) => void;
}

export function ScriptList({ scripts, loading, onDeleteScript, onEditScript }: ScriptListProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Scripts</h1>
          <p className="text-sm text-muted-foreground">Manage your text scripts</p>
        </div>
        <Button asChild>
          <Link href="/scripts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Script
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <p>Loading scripts...</p>
        </div>
      ) : scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No scripts found</h3>
          <p className="text-muted-foreground mb-4">Create your first script to get started.</p>
          <Button asChild>
            <Link href="/scripts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Script
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {scripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onDelete={() => onDeleteScript(script.id)}
              onEdit={() => onEditScript(script)}
            />
          ))}
        </div>
      )}
    </>
  );
}
