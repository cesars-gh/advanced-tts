'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, Download } from 'lucide-react';
import Link from 'next/link';
import type { Script, Section } from '@/lib/types/script.type';
import { useParams, useRouter } from 'next/navigation';

export default function ScriptView() {
  const params = useParams();
  const router = useRouter();
  const scriptId = params.scriptId as string;

  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScript = async () => {
      try {
        const response = await fetch(`/api/scripts/${scriptId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/scripts');
            return;
          }
          throw new Error('Failed to fetch script');
        }
        
        const data = await response.json();
        setScript(data);
      } catch (error) {
        console.error('Failed to load script:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScript();
  }, [scriptId, router]);

  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-2">
              <Link href="/scripts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scripts
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <p>Loading script...</p>
            </div>
          ) : script ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{script.name}</h1>
                  <p className="text-sm text-muted-foreground">{script.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">Generate All</Button>
                  <Button variant="secondary">Export</Button>
                </div>
              </div>

              <div className="space-y-6">
                {script.sections.map((section) => (
                  <ScriptBlock 
                    key={section.sectionId}
                    voice={section.voiceId}
                    text={section.content}
                  />
                ))}

                {script.sections.length === 0 && (
                  <div className="flex justify-center p-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No sections in this script yet.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center p-8">
              <p>Script not found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ScriptBlock({
  voice,
  text,
}: {
  voice: string;
  text: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2 min-w-[80px]">
          <span className="text-emerald-500">◑</span>
          {voice}
        </div>
        <div className="flex-1">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Button size="icon" variant="ghost" className="mt-1">
                <PlayCircle className="h-5 w-5" />
              </Button>
              <p className="flex-1 whitespace-pre-line">{text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 