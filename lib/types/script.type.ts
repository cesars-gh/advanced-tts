export interface Section {
  id: string;
  text: string;
  url?: string;
}

export interface TextScript {
  id: string;
  name: string;
  description: string;
  sections: Section[];
  voice_id: number;
}

export interface CreateScriptDto {
  name: string;
  description: string;
  sections?: Section[];
  voice_id: number;
}

export interface UpdateScriptDto {
  name?: string;
  description?: string;
  sections?: Section[];
  voice_id?: number;
}
