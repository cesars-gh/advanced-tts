import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { TTSService } from '@/lib/services/tts.service';
import { Storage } from '@/lib/services/storage';

export const maxDuration = 60;

// Initialize services
const ttsService = new TTSService();
const storage = new Storage();

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    // Validate request data
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Create a unique filename
    const fileName = `${text.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}.mp3`;
    console.log('fileName:', fileName);

    // Generate audio data
    const generation = await ttsService.generateAudio(text);
    const { audio, duration } = generation.generations[0];

    console.log('Audio generated, uploading to S3...');

    // Upload audio data to S3
    const url = await storage.uploadFile(audio, fileName, {
      duration,
    });

    console.log('Audio uploaded to S3:', url);
    // Return audio data
    return NextResponse.json({
      audioData: audio,
      url,
      format: 'mp3',
      text,
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to process text-to-speech request' },
      { status: 500 }
    );
  }
}
