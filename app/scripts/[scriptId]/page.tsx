'use client';

import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TextScriptBlock, AddNewBlock, VoiceSelect } from '@/components/editor';
import {
  TextScriptProvider,
  useTextScript,
  type TextScriptBlock as TextScriptBlockType,
} from '@/components/script-provider';
import type { Voice } from '@/lib/types/voice.type';
import { useFetchScriptData } from '@/hooks/fetch-text-script';
import { useFetchVoices } from '@/hooks/fetch-voices';
import { DownloadAll } from '@/components/editor/download-button';

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
const PageLayout = ({
  children,
  name,
  description,
}: { children: React.ReactNode; name: string; description: string }) => (
  <main className="flex h-screen">
    <Sidebar />
    <div className="flex-1 overflow-auto">
      <div className="max-w-[900px] mx-auto p-6">
        <ScriptHeader name={name} description={description} />
      </div>
      <div className="max-w-[900px] mx-auto p-6">{children}</div>
    </div>
  </main>
);

// Script header with title, description and back button
const ScriptHeader = ({ name, description }: { name: string; description: string }) => (
  <div className="flex items-center mb-6">
    <div className="mr-auto">
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/scripts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scripts
        </Link>
      </Button>
    </div>
    <div className="flex-1 text-center">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {/* Three dots dropdown */}
    <div className="ml-auto">
      {/* <ScriptMenu /> */}
    </div>
  </div>
);

// Display script blocks
const ScriptContainer = ({ voices }: { voices: Voice[] }) => {
  const { sections, voiceId, setVoiceId, downloadAll } = useTextScript();
  const currentVoice = voices.find((voice) => voice.id === voiceId) ?? voices[0];

  return (
    <div id="script-content" className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <VoiceSelect
          voices={voices}
          currentVoice={currentVoice}
          onVoiceChange={(voice) => setVoiceId(voice.id)}
        />
        <DownloadAll onDownload={downloadAll} />
      </div>
      {/* Map over the blocks from the context state */}
      {sections.map((block: TextScriptBlockType) => (
        <TextScriptBlock key={block.id} currentBlock={block} />
      ))}

      <AddNewBlock />
    </div>
  );
};

export default function ScriptView() {
  const params = useParams();
  const scriptId = params.scriptId as string;
  const { script, loading, error } = useFetchScriptData(scriptId);
  const { voices, loading: voicesLoading } = useFetchVoices();

  // Render the appropriate content based on the state
  const renderContent = () => {
    if (loading || voicesLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!script) return <ErrorState />;

    return (
      // Initialize the provider with the fetched script sections
      <TextScriptProvider
        scriptId={scriptId}
        scriptName={script.name}
        scriptDescription={script.description}
        initialBlocks={[...script.sections]}
        initialVoiceId={script.voice_id || voices[0].id}
      >
        <ScriptContainer voices={voices} />
      </TextScriptProvider>
    );
  };

  return (
    <PageLayout name={script?.name || 'Untitled'} description={script?.description || ''}>
      {renderContent()}
    </PageLayout>
  );
}
