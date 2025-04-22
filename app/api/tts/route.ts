import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { TTSService } from '@/lib/services/tts.service';
import { Storage } from '@/lib/services/storage';
import { VoicesService } from '@/lib/services/voice.service';

export const maxDuration = 60;

// Initialize services
const ttsService = new TTSService();
const storage = new Storage();
const voicesService = new VoicesService();

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    // Validations
    if (!text || !voiceId) {
      return NextResponse.json({ error: 'Text and voiceId are required' }, { status: 400 });
    }

    const voice = await voicesService.getVoiceById(voiceId);
    if (!voice) {
      return NextResponse.json({ error: 'Voice not found' }, { status: 404 });
    }

    // Create a unique filename
    let finalUrl = '';
    const fileName = `${text.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}.mp3`;
    console.log('Generating audio for:', fileName);

    if (voice.provider === 'openai') {
      const response = await ttsService.generateAudioWithOpenAI(text, voice);
      console.log('Audio generated, uploading to S3...');
      finalUrl = await storage.uploadFileFromArrayBuffer(response.arrayBuffer(), fileName);
    }

    if (voice.provider === 'hume') {
      const response = await ttsService.generateAudioWithHume(text, voice);
      const { audio, duration } = response.generations[0];
      console.log('Audio generated, uploading to S3...');
      finalUrl = await storage.uploadFile(audio, fileName, {
        duration,
      });
    }

    console.log('Audio uploaded to S3:', finalUrl);
    // Return audio url
    return NextResponse.json({
      url: finalUrl,
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to process text-to-speech request' },
      { status: 500 }
    );
  }
}
