import type { DevArtifact, DevSystemChange, DevTaskContext, DeveloperService } from './api.types';

let mockArtifacts: DevArtifact[] = [
  {
    id: '1',
    stable_key: 'rule-agentic-behavior',
    artifact_type: 'rule',
    name: 'Agentic Behavior',
    description: 'Protocol for AI Agents to follow the Read-First, Act-Later principle',
    source_type: 'repository',
    source_path: 'rule/AGENTIC-BEHAVIOR.md',
    scope: 'global',
    status: 'active',
    mandatory: true,
    created_at: new Date().toISOString()
  }
];

let mockTaskContexts: DevTaskContext[] = [];
let mockSystemChanges: DevSystemChange[] = [];

export const mockDeveloperService: DeveloperService = {
  getArtifacts: async () => mockArtifacts,
  
  getArtifactByKey: async (key: string) => {
    return mockArtifacts.find(a => a.stable_key === key) || null;
  },
  
  upsertArtifact: async (artifact: Partial<DevArtifact>) => {
    const existingIndex = mockArtifacts.findIndex(a => a.stable_key === artifact.stable_key);
    if (existingIndex > -1) {
      mockArtifacts[existingIndex] = { ...mockArtifacts[existingIndex], ...artifact };
      return mockArtifacts[existingIndex];
    }
    const newArtifact = { 
      id: crypto.randomUUID(), 
      ...artifact,
      created_at: new Date().toISOString()
    } as DevArtifact;
    mockArtifacts.push(newArtifact);
    return newArtifact;
  },

  getTaskContexts: async () => mockTaskContexts,
  
  createTaskContext: async (context: Partial<DevTaskContext>) => {
    const newContext = {
      id: crypto.randomUUID(),
      ...context,
      created_at: new Date().toISOString()
    } as DevTaskContext;
    mockTaskContexts.push(newContext);
    return newContext;
  },

  getSystemChanges: async () => mockSystemChanges,
  
  createSystemChange: async (change: Partial<DevSystemChange>) => {
    const newChange = {
      id: crypto.randomUUID(),
      ...change,
      created_at: new Date().toISOString()
    } as DevSystemChange;
    mockSystemChanges.push(newChange);
    return newChange;
  }
};
