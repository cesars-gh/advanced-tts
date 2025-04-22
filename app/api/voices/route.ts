import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { voiceSchema } from '@/lib/types/voice.type';
import { VoicesService } from '@/lib/services/voice.service';

// Initialize the voices service
const voicesService = new VoicesService();

export async function GET() {
  try {
    const voices = await voicesService.getVoices();
    return NextResponse.json(voices);
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return NextResponse.json({ error: 'Failed to fetch voices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const voice = await request.json();
    const validatedVoice = voiceSchema.parse(voice);
    const newVoice = await voicesService.createVoice(validatedVoice);

    // For now, we'll just return the new voice
    return NextResponse.json(newVoice, { status: 201 });
  } catch (error) {
    console.error('Failed to create voice:', error);
    return NextResponse.json({ error: 'Failed to create voice' }, { status: 500 });
  }
}
