import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TextScriptService } from '@/lib/services/text-script.service';
import type { UpdateScriptDto } from '@/lib/types/script.type';

// Initialize the script service
let scriptService: TextScriptService | null = null;

const getScriptService = async () => {
  if (!scriptService) {
    scriptService = new TextScriptService();
  }
  return scriptService;
};

// GET - Get script by ID
export async function GET(_request: NextRequest, props: { params: Promise<{ scriptId: string }> }) {
  const params = await props.params;
  try {
    const service = await getScriptService();
    const script = await service.getTextScriptById(params.scriptId);

    if (!script) {
      return NextResponse.json({ message: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error('Error fetching script:', error);
    return NextResponse.json({ message: 'Failed to fetch script' }, { status: 500 });
  }
}

// PUT - Update script by ID
export async function PUT(request: NextRequest, props: { params: Promise<{ scriptId: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    const service = await getScriptService();

    if (!body.name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const updateScriptDto: UpdateScriptDto = {
      name: body.name,
      description: body.description,
      voice_id: body.voice_id,
    };

    if (body.sections) {
      updateScriptDto.sections = body.sections;
    }

    const updatedScript = await service.updateScript(params.scriptId, updateScriptDto);

    if (!updatedScript) {
      return NextResponse.json({ message: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json(updatedScript);
  } catch (error) {
    console.error('Error updating script:', error);
    return NextResponse.json({ message: 'Failed to update script' }, { status: 500 });
  }
}

// DELETE - Delete script by ID
export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ scriptId: string }> }
) {
  const params = await props.params;
  try {
    const service = await getScriptService();
    const success = await service.deleteScript(params.scriptId);

    if (!success) {
      return NextResponse.json({ message: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Script deleted successfully' });
  } catch (error) {
    console.error('Error deleting script:', error);
    return NextResponse.json({ message: 'Failed to delete script' }, { status: 500 });
  }
}
