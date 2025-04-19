export interface Section {
  sectionId: string;
  voiceId: string;
  content: string;
}

export interface Script {
  scriptId: string;
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

export interface CreateSectionDto {
  voiceId: string;
  content: string;
}

export interface UpdateSectionDto {
  voiceId?: string;
  content?: string;
} 