export interface Section {
  id: string;
  voice: string;
  text: string;
}

export interface TextScript {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}

export interface CreateScriptDto {
  name: string;
  description: string;
  sections?: Section[];
}

export interface UpdateScriptDto {
  name?: string;
  description?: string;
  sections?: Section[];
}
