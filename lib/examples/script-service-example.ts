import { ScriptService } from '../services/script.service';

async function main() {
  // Create an instance of the ScriptService
  const scriptService = new ScriptService();
  
  // Initialize the service to load mock data
  await scriptService.init();
  
  // Get all scripts (should include the mock script)
  const allScripts = await scriptService.getAllScripts();
  console.log('All scripts:', allScripts);
  
  // Get the mock script by ID
  const mockScript = await scriptService.getScriptById('000-123-456');
  console.log('Mock script:', mockScript);
  
  // Create a new script
  const newScript = await scriptService.createScript({
    name: 'New Script',
    description: 'This is a new script created programmatically',
  });
  console.log('New script created:', newScript);
  
  // Add a section to the new script
  const newSection = await scriptService.addSection(newScript.scriptId, {
    voiceId: 'new-voice-id',
    content: 'This is a new section added to the script',
  });
  console.log('New section added:', newSection);
  
  // Get all scripts again (should now include both the mock and new script)
  const updatedScripts = await scriptService.getAllScripts();
  console.log('Updated scripts:', updatedScripts);
}

// Run the example
main().catch(console.error); 