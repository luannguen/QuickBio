import type { DevArtifact, DevSystemChange, DevTaskContext, DeveloperService, DevFeatureFlag } from './api.types';

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
let mockFeatureFlags: DevFeatureFlag[] = [
  {
    id: '1',
    flag_key: 'dev-control-v2',
    name: 'Developer Control Center V2',
    description: 'Giao diện trung tâm kiểm soát lập trình viên phiên bản 2.0',
    is_enabled: true,
    created_at: new Date().toISOString()
  }
];

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
  },

  getFeatureFlags: async () => mockFeatureFlags,

  toggleFeatureFlag: async (id: string, isEnabled: boolean) => {
    const flag = mockFeatureFlags.find(f => f.id === id);
    if (flag) {
      flag.is_enabled = isEnabled;
      flag.updated_at = new Date().toISOString();
      return flag;
    }
    throw new Error("Mock feature flag not found");
  }
};
