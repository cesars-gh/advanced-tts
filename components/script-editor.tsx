'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Trash2, AudioLines, Loader2, RefreshCcwDot } from 'lucide-react';
import { useTextScript, type TextScriptBlock as TextScriptBlockType } from './script-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { playAudio } from './client.utils';
// Voice options available for selection
const voices = [{ id: 'default', name: 'Default' }];

// TextScriptBlock component for displaying and editing text blocks
export function TextScriptBlock({
  currentBlock,
}: {
  currentBlock: TextScriptBlockType;
}) {
  const { activeBlockId, setActiveBlockId, removeBlock, updateBlock, generateAudio } =
    useTextScript();

  const isEditing = activeBlockId === currentBlock.id;
  const currentVoice = voices.find((v) => v.id === currentBlock.voice) ?? voices[0];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const shouldDisablePlayButton =
    isSpeaking || isGenerating || !currentBlock.text.trim() || !currentBlock?.url;
  const [audioData, setAudioData] = useState<string | null>(currentBlock.audioData ?? null);
  const scriptTextRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const textLength = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(textLength, textLength);
        }
      }, 0);
    }
  }, [isEditing]);

  // Handle exit edit mode
  const exitEditMode = useCallback(() => {
    if (activeBlockId === currentBlock.id) {
      setActiveBlockId('');
    }
  }, [currentBlock.id, activeBlockId, setActiveBlockId]);

  // Handle clicks outside to exit edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isEditing) return;

      const target = event.target as HTMLElement;

      // Exit edit mode only if:
      // 1. We have a valid ref to the script text container
      // 2. The click was outside that container
      // 3. The click wasn't on a dropdown or select element
      if (scriptTextRef.current && !scriptTextRef.current.contains(target)) {
        // Don't exit if clicking on select elements or dropdown components
        const clickedOnSelect = Boolean(
          target.closest('select') ||
            target.closest('[role="combobox"]') ||
            target.closest('[role="listbox"]') ||
            target.closest('[data-radix-select-content]')
        );

        if (!clickedOnSelect) {
          exitEditMode();
        }
      }
    };

    // Add click listener when editing
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, exitEditMode]);

  // Handle enter edit mode
  const enterEditMode = useCallback(() => {
    setActiveBlockId(currentBlock.id); // Set active block directly here
  }, [currentBlock.id, setActiveBlockId]);

  // Handle double click to enter edit mode
  const handleDoubleClick = useCallback(() => {
    if (!isEditing) {
      enterEditMode();
    }
  }, [isEditing, enterEditMode]);

  // Handle text changes
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateBlock(currentBlock.id, { text: e.target.value });
    },
    [currentBlock.id, updateBlock]
  );

  // Handle voice selection
  const handleVoiceChange = useCallback(
    (newVoice: string) => {
      updateBlock(currentBlock.id, { voice: newVoice });
    },
    [currentBlock.id, updateBlock]
  );

  // Handle speaking mode
  const handlePlayBtn = useCallback(() => {
    if (!audioData && !currentBlock?.url) {
      return;
    }

    const audioUrl = currentBlock?.url || String(audioData);
    const isUrl = !!currentBlock?.url;
    setIsSpeaking(true);
    playAudio(audioUrl, isUrl)
      .then(() => {
        setIsSpeaking(false);
      })
      .catch(() => {
        setIsSpeaking(false);
      });
  }, [audioData, currentBlock?.url]);

  // Handle "Generate" button click
  const handleGenerateClick = useCallback(async () => {
    setIsGenerating(true);
    try {
      const newAudioData = await generateAudio(currentBlock.id);
      await playAudio(newAudioData);
      setAudioData(newAudioData);
    } finally {
      setIsGenerating(false);
    }
  }, [currentBlock.id, generateAudio]);

  // Handle block deletion
  const handleDelete = useCallback(() => {
    removeBlock(currentBlock.id);
  }, [currentBlock.id, removeBlock]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2 min-w-[80px] py-4">
          <span className="text-emerald-500">
            <AudioLines className="h-5 w-5" />
          </span>
          {currentVoice?.name}
        </div>
        <div className="flex-1" onDoubleClick={handleDoubleClick}>
          <div ref={scriptTextRef} className="script-text bg-secondary/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Button variant="ghost" onClick={handlePlayBtn} disabled={shouldDisablePlayButton}>
                {isSpeaking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <PlayCircle className="w-5 h-5" />
                )}
              </Button>
              {isEditing ? (
                <textarea
                  ref={textareaRef}
                  className="flex-1 bg-transparent focus:outline-none text-gray-400"
                  placeholder="Enter text here..."
                  value={currentBlock.text}
                  onChange={handleTextChange}
                  rows={Math.max(2, currentBlock.text.split('\n').length)}
                  maxLength={1000}
                  disabled={isGenerating}
                />
              ) : (
                <p className="flex-1 whitespace-pre-line select-none">
                  {currentBlock.text || '(Empty block)'}
                </p>
              )}

              <Button variant="ghost" onClick={handleDelete}>
                <Trash2 className="w-5 h-5 hover:text-red-800" />
              </Button>
            </div>

            {isEditing && (
              <div className="flex justify-between items-center gap-3 mt-3">
                <div className="text-xs text-muted-foreground">
                  {currentBlock.text.length}/1000 characters
                </div>
                <div className="flex items-center gap-2">
                  <Select value={currentVoice.id} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-[140px] rounded-full px-4 bg-primary/80 text-primary-foreground">
                      <AudioLines className="h-4 w-4 mr-2 text-emerald-500" />
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary/80 text-primary-foreground">
                      {voices.map((voiceOption) => (
                        <SelectItem key={voiceOption.id} value={voiceOption.id}>
                          {voiceOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Generate audio button */}
                  <Button
                    variant="ghost"
                    onClick={handleGenerateClick}
                    disabled={isGenerating || !currentBlock.text.trim()}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCcwDot className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// AddNewBlock component to add a new text block
export function AddNewBlock() {
  const { addBlock } = useTextScript();

  return (
    <div className="flex justify-center items-center py-4">
      <Button variant="outline" onClick={addBlock}>
        Add new block
      </Button>
    </div>
  );
}
