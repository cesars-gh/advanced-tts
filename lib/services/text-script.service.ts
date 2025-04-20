import type { TextScript, CreateScriptDto, UpdateScriptDto } from '../types/script.type';
import { supabaseClient } from '@/lib/supabaseClient';

export class TextScriptService {
  private tableName = 'voice_scripts';

  // Create a new script
  async createTextScript(createScriptDto: CreateScriptDto): Promise<TextScript> {
    const textScript: Omit<TextScript, 'id'> = {
      name: createScriptDto.name,
      description: createScriptDto.description,
      sections: createScriptDto.sections || [],
    };

    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert(textScript)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create script: ${error.message}`);
    }

    return data;
  }

  // Get a script by ID
  async getTextScriptById(scriptId: string): Promise<TextScript | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', scriptId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  // Get all scripts
  async getAllVoiceScripts(): Promise<TextScript[]> {
    const { data, error } = await supabaseClient.from(this.tableName).select('*');

    if (error) {
      throw new Error(`Failed to get scripts: ${error.message}`);
    }

    return data || [];
  }

  // Update a script
  async updateScript(
    scriptId: string,
    updateScriptDto: UpdateScriptDto
  ): Promise<TextScript | null> {
    const { data: existingScript } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', scriptId)
      .single();

    if (!existingScript) {
      return null;
    }

    const updatedScript = {
      ...existingScript,
      name: updateScriptDto.name ?? existingScript.name,
      description: updateScriptDto.description ?? existingScript.description,
      sections: updateScriptDto.sections ?? existingScript.sections,
    };

    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(updatedScript)
      .eq('id', scriptId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update script: ${error.message}`);
    }

    return data;
  }

  // Delete a script
  async deleteScript(scriptId: string): Promise<boolean> {
    const { error } = await supabaseClient.from(this.tableName).delete().eq('id', scriptId);

    return !error;
  }
}
