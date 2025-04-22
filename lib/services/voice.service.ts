import { supabaseClient } from '@/lib/supabaseClient';
import type { Voice } from '@/lib/types/voice.type';

export class VoicesService {
  private tableName = 'voices';

  async getVoices(): Promise<Voice[]> {
    const { data, error } = await supabaseClient.from(this.tableName).select('*');
    if (error) {
      throw new Error(`Failed to get voices: ${error.message}`);
    }
    return data;
  }

  async getVoiceById(id: string): Promise<Voice | null> {
    const { data, error } = await supabaseClient.from(this.tableName).select('*').eq('id', id);
    if (error) {
      throw new Error(`Failed to get voice: ${error.message}`);
    }
    return data[0] || null;
  }

  async createVoice(voice: Omit<Voice, 'id'>): Promise<Voice> {
    const { data, error } = await supabaseClient.from(this.tableName).insert(voice).select();
    if (error) {
      throw new Error(`Failed to create voice: ${error.message}`);
    }
    return data[0];
  }

  async updateVoice(id: string, voice: Partial<Voice>): Promise<Voice> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(voice)
      .eq('id', id)
      .select();
    if (error) {
      throw new Error(`Failed to update voice: ${error.message}`);
    }
    return data[0];
  }

  async deleteVoice(id: string): Promise<boolean> {
    const { error } = await supabaseClient.from(this.tableName).delete().eq('id', id);
    if (error) {
      throw new Error(`Failed to delete voice: ${error.message}`);
    }
    return true;
  }
}
