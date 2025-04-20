import { HumeClient } from 'hume';

const humeClient = new HumeClient({
  apiKey: process.env.HUME_API_KEY as string,
});

// Defaults
const VOICE_ID = '7eede4ed-9c0e-44ff-9292-3a331d952de9';
const DEFAULT_VOICE_DESCRIPTION =
  'The speaker talks super slowly, whispering softly every word';
const SPEED = 0.7;

export class TTSService {
  private hume: HumeClient;
  constructor() {
    this.hume = humeClient;
  }

  async generateAudio(text: string) {
    const result = await this.hume.tts.synthesizeJson({
      utterances: [
        {
          text,
          description: DEFAULT_VOICE_DESCRIPTION,
          voice: { id: VOICE_ID },
          speed: SPEED,
        },
      ],
    });
    return result;
  }
}
