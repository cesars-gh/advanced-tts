import * as React from 'react';

import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

interface AutoResizingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const AutoResizingTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizingTextareaProps>(
  ({ value, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height first
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Then set to scrollHeight
      }
    }, [textareaRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height first
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Then set to scrollHeight
      }
      onChange?.(e); // Call the parent onChange
    };

    return (
      <textarea
        {...props}
        value={value}
        onChange={handleChange}
        ref={textareaRef}
        rows={1}
        style={{
          overflow: 'hidden',
          resize: 'none',
          ...props.style,
        }}
      />
    );
  }
);

AutoResizingTextarea.displayName = 'AutoResizingTextarea';

export { Textarea, AutoResizingTextarea };
