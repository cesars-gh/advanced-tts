'use client';
import _debounce from 'lodash.debounce';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Define the type for a text script block
export type TextScriptBlock = {
  id: string;
  text: string;
  voice: string;
  audioData?: string; // Base64 encoded audio data
  url?: string; // S3 URL of the audio file
};

// Define the context type for the TextScriptProvider
type TextScriptContextType = {
  scriptId: string | null;
  scriptName: string | null;
  scriptDescription: string | null;
  sections: TextScriptBlock[];
  activeBlockId: string | null;
  setScriptId: (id: string | null) => void;
  setActiveBlockId: (id: string | null) => void;
  updateBlock: (id: string, updates: Partial<TextScriptBlock>) => void;
  addBlock: () => string;
  removeBlock: (id: string) => void;
  generateAudio: (id: string) => Promise<string>;
  saveScript: (updatedBlocks: TextScriptBlock[]) => Promise<void>; // New function to manually save script
};

// Create the context with default values
export const TextScriptContext = createContext<TextScriptContextType>({
  scriptId: null,
  scriptName: null,
  scriptDescription: null,
  sections: [],
  activeBlockId: null,
  setScriptId: () => {},
  setActiveBlockId: () => {},
  updateBlock: () => {},
  addBlock: () => '',
  removeBlock: () => {},
  generateAudio: async () => '',
  saveScript: async () => {},
});

// Provider component for managing text script state
export function TextScriptProvider({
  children,
  scriptId = null,
  scriptName = '',
  scriptDescription = '',
  initialBlocks = [],
}: {
  children: React.ReactNode;
  scriptId?: string | null;
  scriptName?: string;
  scriptDescription?: string;
  initialBlocks?: Array<TextScriptBlock>;
}) {
  const [internalScriptId, setInternalScriptId] = useState<string | null>(scriptId);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<TextScriptBlock[]>([...initialBlocks]);

  // Update internal state when scriptId prop changes
  useEffect(() => {
    setInternalScriptId(scriptId);
  }, [scriptId]);

  // Function to set the script ID
  const handleSetScriptId = useCallback((id: string | null) => {
    setInternalScriptId(id);
  }, []);

  // Function to save script
  const saveScript = useCallback(
    async (updatedBlocks: TextScriptBlock[]) => {
      if (!internalScriptId) return;

      try {
        const response = await fetch(`/api/scripts/${internalScriptId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: scriptName,
            description: scriptDescription,
            sections: updatedBlocks,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save script');
        }
      } catch (error) {
        console.error('Error saving script:', error);
      }
    },
    [internalScriptId, scriptName, scriptDescription]
  );

  const debouncedSaveScript = useCallback(_debounce(saveScript, 1000), []);

  // Function to update a block's properties
  const updateBlock = useCallback(
    (id: string, updates: Partial<TextScriptBlock>) => {
      const updatedBlocks = blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      );
      setBlocks(updatedBlocks);
      debouncedSaveScript(updatedBlocks);
    },
    [debouncedSaveScript, blocks]
  );

  // Function to add a new block
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

  // Function to remove a block
  const removeBlock = useCallback(
    (id: string) => {
      const updatedBlocks = blocks.filter((block) => block.id !== id);
      setBlocks(updatedBlocks);
      if (activeBlockId === id) {
        setActiveBlockId(null);
      }
      saveScript(updatedBlocks); // Trigger debounced save after removing block
    },
    [activeBlockId, saveScript, blocks]
  );

  // Function to generate audio for a block
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
            voice: block.voice,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate audio');
        }
        const data = await response.json();
        // Update the block with the generated audio url
        updateBlock(id, { url: data.url });
        return data.audioData;
      } catch (error) {
        console.error('Error generating audio:', error);
        return '';
      }
    },
    [blocks, updateBlock]
  );

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
        saveScript, // Expose manual save function
      }}
    >
      {children}
    </TextScriptContext.Provider>
  );
}

// Hook to use the TextScriptContext
export function useTextScript() {
  const context = useContext(TextScriptContext);
  if (!context) {
    throw new Error('useTextScript must be used within a TextScriptProvider');
  }
  return context;
}
