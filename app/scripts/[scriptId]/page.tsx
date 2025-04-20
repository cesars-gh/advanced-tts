'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { TextScript } from '@/lib/types/script.type';
import { useParams, useRouter } from 'next/navigation';
import { TextScriptBlock, AddNewBlock } from '@/components/script-editor';
import {
  TextScriptProvider,
  useTextScript,
  type TextScriptBlock as TextScriptBlockType,
} from '@/components/script-provider';

// Interface for the hook return value
interface UseScriptReturn {
  script: TextScript | null;
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching script data
const useFetchScriptData = (scriptId: string): UseScriptReturn => {
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

// Loading and error state components
const LoadingState = () => (
  <div className="flex justify-center p-8">
    <p>Loading script...</p>
  </div>
);

const ErrorState = ({ message = 'Script not found' }: { message?: string }) => (
  <div className="flex justify-center p-8">
    <p>{message}</p>
  </div>
);

// Layout component to maintain consistent page structure
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex h-screen">
    <Sidebar />
    <div className="flex-1 overflow-auto">
      <div className="max-w-[900px] mx-auto p-6">
        <BackButton />
        {children}
      </div>
    </div>
  </main>
);

// Navigation component for the back button
const BackButton = () => (
  <div className="mb-6">
    <Button variant="ghost" asChild className="mb-2">
      <Link href="/scripts">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Scripts
      </Link>
    </Button>
  </div>
);

// Script header with title, description and action buttons
const ScriptHeader = ({ script }: { script: TextScript }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold">{script.name}</h1>
      <p className="text-sm text-muted-foreground">{script.description}</p>
    </div>
    <div className="flex gap-2">
      {/* <Button variant="outline">Generate All</Button>
      <Button variant="default">Export</Button> */}
    </div>
  </div>
);

// Display script content or empty message
const ScriptContent = () => {
  // Use the context hook to get the blocks
  const { sections } = useTextScript();

  return (
    <div className="space-y-6">
      {/* Map over the blocks from the context state */}
      {sections.map((block: TextScriptBlockType) => (
        <TextScriptBlock
          key={block.id}
          currentBlock={block}
        />
      ))}

      <AddNewBlock />
    </div>
  );
};

export default function ScriptView() {
  const params = useParams();
  const scriptId = params.scriptId as string;
  // Use the renamed fetch hook
  const { script, loading, error } = useFetchScriptData(scriptId);

  // Render the appropriate content based on the state
  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!script) return <ErrorState />;

    return (
      // Initialize the provider with the fetched script sections
      <TextScriptProvider
        scriptId={scriptId}
        scriptName={script.name}
        scriptDescription={script.description}
        initialBlocks={[...script.sections]}
      >
        <ScriptHeader script={script} />
        <ScriptContent />
      </TextScriptProvider>
    );
  };

  return <PageLayout>{renderContent()}</PageLayout>;
}
