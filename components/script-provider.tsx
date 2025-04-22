'use client';
import _debounce from 'lodash.debounce';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { saveTextScript } from './client.utils';

// Define the type for a text script block
export type TextScriptBlock = {
  id: string;
  text: string;
  url?: string; // S3 URL of the audio file
};

// Define the context type for the TextScriptProvider
type TextScriptContextType = {
  scriptId: string | null;
  scriptName: string | null;
  scriptDescription: string | null;
  voiceId: number | null;
  sections: TextScriptBlock[];
  activeBlockId: string | null;
  // Setters
  setScriptId: (id: string | null) => void;
  setActiveBlockId: (id: string | null) => void;
  updateBlock: (id: string, updates: Partial<TextScriptBlock>) => void;
  addBlock: () => string;
  removeBlock: (id: string) => void;
  generateAudio: (id: string) => Promise<void>;
  downloadAll: () => Promise<void>;
  setVoiceId: (voiceId: number) => void;
};

// Create the context with default values
export const TextScriptContext = createContext<TextScriptContextType>({
  scriptId: null,
  scriptName: null,
  scriptDescription: null,
  voiceId: null,
  sections: [],
  activeBlockId: null,
  setScriptId: () => {},
  setActiveBlockId: () => {},
  updateBlock: () => {},
  addBlock: () => '',
  removeBlock: () => {},
  generateAudio: async () => {},
  setVoiceId: () => {},
  downloadAll: async () => {},
});

/** Provider component for managing text script state
  - Manages the scriptId, scriptName, scriptDescription, and blocks
  - Manages the activeBlockId
  - Manages the blocks
  - Manages the generateAudio function
  - Manages the saveScript function
*/
export function TextScriptProvider({
  children,
  scriptId = null,
  scriptName = '',
  scriptDescription = '',
  initialBlocks = [],
  initialVoiceId = null,
}: {
  children: React.ReactNode;
  scriptId?: string | null;
  scriptName?: string;
  scriptDescription?: string;
  initialBlocks?: Array<TextScriptBlock>;
  initialVoiceId?: number | null;
}) {
  const [internalScriptId, setInternalScriptId] = useState<string | null>(scriptId);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<TextScriptBlock[]>([...initialBlocks]);
  const [voiceId, setVoiceId] = useState<number | null>(initialVoiceId);

  // Update internal state when scriptId prop changes
  useEffect(() => {
    setInternalScriptId(scriptId);
  }, [scriptId]);

  /** Set Script ID **
    - id: id of the script to set
  */
  const handleSetScriptId = useCallback((id: string | null) => {
    setInternalScriptId(id);
  }, []);

  /** Save script **/
  const preparePayload = (state: Partial<TextScriptContextType>) => ({
    id: state.scriptId ?? internalScriptId ?? '',
    name: state.scriptName ?? scriptName,
    description: state.scriptDescription ?? scriptDescription,
    sections: state.sections ?? blocks,
    voice_id: state.voiceId ?? voiceId ?? 0,
  });

  const debouncedSaveScript = useCallback(_debounce(saveTextScript, 1000), []);

  /** Update a block **
    - id: id of the block to update
    - updates: updates to the block
    - Debounces the save to 1 second
  */
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const updateBlock = useCallback(
    (id: string, updates: Partial<TextScriptBlock>) => {
      const updatedBlocks = blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      );
      const payload = preparePayload({
        sections: updatedBlocks,
      });

      setBlocks(updatedBlocks);
      debouncedSaveScript(payload);
    },
    [debouncedSaveScript, blocks]
  );

  /** Add a block **
    - id: id of the new block
  */
  const addBlock = useCallback(() => {
    const newBlockId = crypto.randomUUID();
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        id: newBlockId,
        voice: 'default',
        text: '',
      },
    ]);
    setActiveBlockId(newBlockId);
    return newBlockId;
  }, []);

  /** Remove a block **
    - id: id of the block to remove
  */
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const removeBlock = useCallback(
    (id: string) => {
      const updatedBlocks = blocks.filter((block) => block.id !== id);
      setBlocks(updatedBlocks);
      const payload = preparePayload({
        sections: updatedBlocks,
      });
      if (activeBlockId === id) {
        setActiveBlockId(null);
      }
      debouncedSaveScript(payload);
    },
    [activeBlockId, blocks]
  );

  /** Set Voice ID **
    - id: id of the voice to set
  */
  const handleSetVoiceId = (id: number) => {
    setVoiceId(id);
    debouncedSaveScript(preparePayload({ voiceId: id }));
  };

  /** Generate audio for a block **
    - id: id of the block to generate audio for
    - Returns the audioData of the generated audio
  */
  const generateAudio = useCallback(
    async (id: string) => {
      const block = blocks.find((b) => b.id === id);
      if (!block || !block.text.trim()) {
        return;
      }

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: block.text,
            voiceId, // current voiceId from the state
          }),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        // Update the block with the generated audio url
        updateBlock(id, { url: data.url });
      } catch (error) {
        toast.error('Error generating audio', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
        console.error('Error generating audio:', error);
      }
    },
    [blocks, updateBlock, voiceId]
  );

  /** Download All */
  const downloadAll = useCallback(async () => {
    const endpoint = 'https://audio-merger.onrender.com/merge';
    const audioUrls = blocks.map((block) => block.url);
    // the endpoint returns an audio file
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: audioUrls,
      }),
    });
    const audioFile = await response.blob();
    const url = URL.createObjectURL(audioFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptName}-${Date.now()}.mp3`;
    a.click();
  }, [blocks, scriptName]);

  return (
    <TextScriptContext.Provider
      value={{
        scriptId: internalScriptId,
        scriptName,
        scriptDescription,
        sections: blocks,
        activeBlockId,
        setScriptId: handleSetScriptId,
        setActiveBlockId,
        updateBlock,
        addBlock,
        removeBlock,
        generateAudio,
        setVoiceId: handleSetVoiceId,
        voiceId,
        downloadAll,
      }}
    >
      {children}
    </TextScriptContext.Provider>
  );
}

/* Hook to use the TextScriptContext
  - Returns the context values
  - Throws an error if the context is not found
*/
export function useTextScript() {
  const context = useContext(TextScriptContext);
  if (!context) {
    throw new Error('useTextScript must be used within a TextScriptProvider');
  }
  return context;
}
