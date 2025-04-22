'use client';

import type { TextScript } from '@/lib/types/script.type';

/**
 * API Utils *
 */
export const saveTextScript = async (script: TextScript) => {
  if (!script.id) {
    return;
  }
  const payload = {
    name: script.name,
    description: script.description,
    sections: script.sections,
    voice_id: script.voice_id,
  };

  try {
    const response = await fetch(`/api/scripts/${script.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save script');
    }
  } catch (error) {
    console.error('Error saving script:', error);
  }
};

/**
 * Voice Utils *
 */

export const OPENAI_VOICES = [
  'alloy',
  'ash',
  'ballad',
  'coral',
  'echo',
  'fable',
  'nova',
  'onyx',
  'sage',
  'shimmer',
];
