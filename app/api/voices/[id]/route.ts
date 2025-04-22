import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { VoicesService } from '@/lib/services/voice.service';
import { voiceSchema } from '@/lib/types/voice.type';

// Initialize the voices service
const voicesService = new VoicesService();

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voice = await voicesService.getVoiceById(id);

  if (!voice) {
    return NextResponse.json({ error: 'Voice not found' }, { status: 404 });
  }
  return NextResponse.json(voice);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const voice = await request.json();
    // validate the voice
    voiceSchema.parse(voice);
    // update the voice
    const updatedVoice = await voicesService.updateVoice(id, voice);

    // Return the updated voice
    return NextResponse.json(updatedVoice);
  } catch (error) {
    console.error('Error updating voice:', error);
    return NextResponse.json({ error: 'Failed to update voice' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await voicesService.deleteVoice(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Failed to delete voice' }, { status: 500 });
  }
  return NextResponse.json({ deleted: true });
}
