import type {
	Script,
	Section,
	CreateScriptDto,
	UpdateScriptDto,
	CreateSectionDto,
	UpdateSectionDto,
} from "../types/script.type";
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Generate a random UUID
const uuidv4 = () => {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
};

export class ScriptService {
	private scripts: Map<string, Script> = new Map();

	async init() {
		try {
			// Get the absolute path to the mock JSON file
			const file = await fs.readFile(path.resolve(process.cwd(), 'lib/mock/script-123.json'), 'utf8');
			
			// Read the JSON file
			const mockData = JSON.parse(file);
			
			// Add the mock script to the scripts Map
			this.scripts.set(mockData.scriptId, mockData);
			
			console.log(`Loaded mock script: ${mockData.name}`);
			return true;
		} catch (error) {
			console.error('Failed to load mock script:', error);
			return false;
		}
	}

	// Create a new script
	async createScript(createScriptDto: CreateScriptDto): Promise<Script> {
		const scriptId = uuidv4();
		const script: Script = {
			scriptId,
			name: createScriptDto.name,
			description: createScriptDto.description,
			sections: createScriptDto.sections || [],
		};

		this.scripts.set(scriptId, script);
		return script;
	}

	// Get a script by ID
	async getScriptById(scriptId: string): Promise<Script | null> {
		return this.scripts.get(scriptId) || null;
	}

	// Get all scripts
	async getAllScripts(): Promise<Script[]> {
		return Array.from(this.scripts.values());
	}

	// Update a script
	async updateScript(
		scriptId: string,
		updateScriptDto: UpdateScriptDto,
	): Promise<Script | null> {
		const script = this.scripts.get(scriptId);
		if (!script) {
			return null;
		}

		const updatedScript: Script = {
			...script,
			name: updateScriptDto.name || script.name,
			description: updateScriptDto.description || script.description,
			sections: updateScriptDto.sections || script.sections,
		};

		this.scripts.set(scriptId, updatedScript);
		return updatedScript;
	}

	// Delete a script
	async deleteScript(scriptId: string): Promise<boolean> {
		return this.scripts.delete(scriptId);
	}

	// Add a section to a script
	async addSection(
		scriptId: string,
		createSectionDto: CreateSectionDto,
	): Promise<Section | null> {
		const script = this.scripts.get(scriptId);
		if (!script) {
			return null;
		}

		const section: Section = {
			sectionId: uuidv4(),
			voiceId: createSectionDto.voiceId,
			content: createSectionDto.content,
		};

		script.sections.push(section);
		this.scripts.set(scriptId, script);
		return section;
	}

	// Get a section by ID
	async getSectionById(
		scriptId: string,
		sectionId: string,
	): Promise<Section | null> {
		const script = this.scripts.get(scriptId);
		if (!script) {
			return null;
		}

		return (
			script.sections.find((section) => section.sectionId === sectionId) || null
		);
	}

	// Update a section
	async updateSection(
		scriptId: string,
		sectionId: string,
		updateSectionDto: UpdateSectionDto,
	): Promise<Section | null> {
		const script = this.scripts.get(scriptId);
		if (!script) {
			return null;
		}

		const sectionIndex = script.sections.findIndex(
			(section) => section.sectionId === sectionId,
		);
		if (sectionIndex === -1) {
			return null;
		}

		const updatedSection: Section = {
			...script.sections[sectionIndex],
			voiceId:
				updateSectionDto.voiceId || script.sections[sectionIndex].voiceId,
			content:
				updateSectionDto.content || script.sections[sectionIndex].content,
		};

		script.sections[sectionIndex] = updatedSection;
		this.scripts.set(scriptId, script);
		return updatedSection;
	}

	// Delete a section
	async deleteSection(scriptId: string, sectionId: string): Promise<boolean> {
		const script = this.scripts.get(scriptId);
		if (!script) {
			return false;
		}

		const initialLength = script.sections.length;
		script.sections = script.sections.filter(
			(section) => section.sectionId !== sectionId,
		);

		if (script.sections.length !== initialLength) {
			this.scripts.set(scriptId, script);
			return true;
		}

		return false;
	}
}
