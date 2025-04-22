import { HumeClient } from 'hume';
import type { Voice } from '../types/voice.type';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const humeClient = new HumeClient({
  apiKey: process.env.HUME_API_KEY as string,
});

// Defaults
const DEFAULT_SPEED = 0.7;

export class TTSService {
  private hume: HumeClient;
  constructor() {
    this.hume = humeClient;
  }

  async generateAudioWithHume(text: string, voice: Voice) {
    console.log('Generating audio with Hume...');
    const result = await this.hume.tts.synthesizeJson({
      utterances: [
        {
          text,
          description: voice.prompt,
          speed: DEFAULT_SPEED,
        },
      ],
    });
    return result;
  }

  async generateAudioWithOpenAI(text: string, voice: Voice) {
    console.log('Generating audio with OpenAI...');
    if (!voice.openaiVoice) {
      throw new Error('OpenAI preset voice not provided');
    }

    const response = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: voice.openaiVoice,
      input: text,
      instructions: voice.prompt,
    });

    return response;
  }
}
