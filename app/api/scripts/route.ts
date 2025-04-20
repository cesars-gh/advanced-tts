import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TextScriptService } from '@/lib/services/text-script.service';
import type { CreateScriptDto } from '@/lib/types/script.type';

// Initialize the script service
let scriptService: TextScriptService | null = null;

const getScriptService = async () => {
  if (!scriptService) {
    scriptService = new TextScriptService();
  }
  return scriptService;
};

// GET - Get all scripts
export async function GET() {
  try {
    const service = await getScriptService();
    const scripts = await service.getAllVoiceScripts();
    return NextResponse.json(scripts);
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json({ message: 'Failed to fetch scripts' }, { status: 500 });
  }
}

// POST - Create a new script
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const service = await getScriptService();

    const createScriptDto: CreateScriptDto = {
      name: body.name,
      description: body.description || '',
      sections: body.sections || [],
    };

    const newScript = await service.createTextScript(createScriptDto);
    return NextResponse.json(newScript, { status: 201 });
  } catch (error) {
    console.error('Error creating script:', error);
    return NextResponse.json({ message: 'Failed to create script' }, { status: 500 });
  }
}
