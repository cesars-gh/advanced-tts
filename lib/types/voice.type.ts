import { z } from 'zod';

export type Voice = {
  id: number;
  name: string;
  provider: 'openai' | 'hume';
  openaiVoice?: string;
  prompt: string;
  createdAt?: string;
  updatedAt?: string;
};

// zod schema
export const voiceSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  provider: z.enum(['openai', 'hume']),
  openaiVoice: z.string().optional(),
  prompt: z.string().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
