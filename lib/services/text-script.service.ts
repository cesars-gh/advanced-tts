import type {
  TextScript,
  Section,
  CreateScriptDto,
  UpdateScriptDto,
  CreateSectionDto,
  UpdateSectionDto,
} from '../types/script.type';
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
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*');

    if (error) {
      throw new Error(`Failed to get scripts: ${error.message}`);
    }

    return data || [];
  }

  // Update a script
  async updateScript(scriptId: string, updateScriptDto: UpdateScriptDto): Promise<TextScript | null> {
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
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id', scriptId);

    return !error;
  }

  // Add a section to a script
  async addSection(scriptId: string, createSectionDto: CreateSectionDto): Promise<Section | null> {
    const { data: script } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', scriptId)
      .single();

    if (!script) {
      return null;
    }

    const section: Section = {
      sectionId: crypto.randomUUID(),
      voiceId: createSectionDto.voiceId,
      content: createSectionDto.content,
    };

    const updatedSections = [...script.sections, section];

    const { error } = await supabaseClient
      .from(this.tableName)
      .update({ sections: updatedSections })
      .eq('id', scriptId);

    if (error) {
      throw new Error(`Failed to add section: ${error.message}`);
    }

    return section;
  }

  // Get a section by ID
  async getSectionById(scriptId: string, sectionId: string): Promise<Section | null> {
    const { data: script } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', scriptId)
      .single();

    if (!script) {
      return null;
    }

    return script.sections.find((section: Section) => section.sectionId === sectionId) || null;
  }

  // Update a section
  async updateSection(
    scriptId: string,
    sectionId: string,
    updateSectionDto: UpdateSectionDto
  ): Promise<Section | null> {
    const { data: script } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', scriptId)
      .single();

    if (!script) {
      return null;
    }

    const sectionIndex = script.sections.findIndex((section: Section) => section.sectionId === sectionId);
    if (sectionIndex === -1) {
      return null;
    }

    const updatedSection: Section = {
      ...script.sections[sectionIndex],
      voiceId: updateSectionDto.voiceId ?? script.sections[sectionIndex].voiceId,
      content: updateSectionDto.content ?? script.sections[sectionIndex].content,
    };

    const updatedSections = [...script.sections];
    updatedSections[sectionIndex] = updatedSection;

    const { error } = await supabaseClient
      .from(this.tableName)
      .update({ sections: updatedSections })
      .eq('id', scriptId);

    if (error) {
      throw new Error(`Failed to update section: ${error.message}`);
    }

    return updatedSection;
  }

  // Delete a section
  async deleteSection(scriptId: string, sectionId: string): Promise<boolean> {
    const { data: script } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id', scriptId)
      .single();

    if (!script) {
      return false;
    }

    const updatedSections = script.sections.filter((section: Section) => section.sectionId !== sectionId);
    
    if (updatedSections.length === script.sections.length) {
      return false;
    }

    const { error } = await supabaseClient
      .from(this.tableName)
      .update({ sections: updatedSections })
      .eq('id', scriptId);

    return !error;
  }
}
