'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { TextScript } from '@/lib/types/script.type';

export default function Scripts() {
  const [scripts, setScripts] = useState<TextScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const response = await fetch('/api/scripts');
        if (!response.ok) {
          throw new Error('Failed to fetch scripts');
        }
        const data = await response.json();
        setScripts(data);
      } catch (error) {
        console.error('Failed to load scripts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScripts();
  }, []);

  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Scripts</h1>
              <p className="text-sm text-muted-foreground">Manage your text-to-speech scripts</p>
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
                <Link 
                  key={script.id} 
                  href={`/scripts/${script.id}`}
                  className="block border p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <h3 className="font-medium text-lg">{script.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{script.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{script.sections.length} sections</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 