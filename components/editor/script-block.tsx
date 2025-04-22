'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AutoResizingTextarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, RefreshCcw } from 'lucide-react';
import { useTextScript, type TextScriptBlock as TextScriptBlockType } from '../script-provider';
import { PlayAudio } from './play-audio';

export function TextScriptBlock({
  currentBlock,
}: {
  currentBlock: TextScriptBlockType;
}) {
  const { activeBlockId, setActiveBlockId, removeBlock, updateBlock, generateAudio } =
    useTextScript();

  const isEditing = activeBlockId === currentBlock.id;
  const [isGenerating, setIsGenerating] = useState(false);
  const [playOnMount, setPlayOnMount] = useState(false);
  const scriptTextRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Focus the textarea when entering edit mode */
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const textLength = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(textLength, textLength);
        }
      }, 0);
    }
  }, [isEditing]);

  /** Handle exit edit mode */
  const exitEditMode = useCallback(() => {
    if (activeBlockId === currentBlock.id) {
      setActiveBlockId('');
    }
  }, [currentBlock.id, activeBlockId, setActiveBlockId]);

  /** Handle clicks outside to exit edit mode */
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

  /** Enter Edit Mode */
  const handleDoubleClick = useCallback(() => {
    if (!isEditing) {
      setActiveBlockId(currentBlock.id);
    }
  }, [isEditing, currentBlock.id, setActiveBlockId]);

  /** Handle text changes */
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateBlock(currentBlock.id, { text: e.target.value });
    },
    [currentBlock.id, updateBlock]
  );

  /** Handle "Generate" button click */
  const handleRegenerateClick = useCallback(async () => {
    setIsGenerating(true);
    try {
      await generateAudio(currentBlock.id);
    } finally {
      setIsGenerating(false);
      setPlayOnMount(true);
    }
  }, [currentBlock.id, generateAudio]);

  /** Handle block deletion */
  const handleDelete = useCallback(() => {
    removeBlock(currentBlock.id);
  }, [currentBlock.id, removeBlock]);

  /** Regenerate Button */
  const renderRegenerateButton = () => {
    const isDisabled = !currentBlock.text.trim();
    const loadingIcon = <Loader2 className="w-5 h-5 animate-spin" />;
    const refreshIcon = <RefreshCcw className="w-5 h-5" />;
    const icon = isGenerating ? loadingIcon : refreshIcon;
    if (isGenerating) {
      return null;
    }

    return (
      <Button variant="ghost" onClick={handleRegenerateClick} disabled={isDisabled}>
        {icon}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="">
        <div className="" onDoubleClick={handleDoubleClick}>
          <div ref={scriptTextRef} className="script-text bg-secondary/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              {/* PLAY/GENERATE BUTTONS */}
              <div className="flex flex-col gap-2">
                <PlayAudio
                  url={currentBlock.url}
                  playOnMount={playOnMount}
                  onGenerate={handleRegenerateClick}
                  isGenerating={isGenerating}
                />
                {currentBlock.url && renderRegenerateButton()}
              </div>
              {/* EDITING MODE */}
              {isEditing ? (
                <AutoResizingTextarea
                  ref={textareaRef}
                  className="flex-1 bg-transparent focus:outline-none text-gray-400"
                  placeholder="Enter text here..."
                  value={currentBlock.text}
                  onChange={handleTextChange}
                  maxLength={1000}
                  disabled={isGenerating}
                />
              ) : (
                <p className="flex-1 whitespace-pre-line">{currentBlock.text || '(Empty block)'}</p>
              )}

              {/* DELETE BUTTON */}
              <Button variant="ghost" onClick={handleDelete}>
                <Trash2 className="w-5 h-5 hover:text-red-800" />
              </Button>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-3">
                <p className="text-xs text-muted-foreground">
                  {currentBlock.text.length}/1000 characters
                </p>
                {/* <div className="flex items-center gap-2">
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
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
