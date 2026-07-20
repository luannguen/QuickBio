export interface DevArtifact {
  id: string;
  stable_key: string;
  artifact_type: 'rule' | 'skill' | 'pattern' | 'workflow' | 'checklist' | 'bootstrap' | 'architecture_document' | 'migration' | 'test_plan';
  name: string;
  description?: string;
  source_type: 'repository' | 'database' | 'remote';
  source_path?: string;
  version?: string;
  checksum?: string;
  scope: 'global' | 'project' | 'domain' | 'tech_stack' | 'security';
  status: 'active' | 'deprecated' | 'experimental' | 'archived';
  mandatory: boolean;
  trigger_conditions?: any; // e.g. { "tech_stacks": ["nextjs"] }
  dependency_keys?: string[];
  conflict_keys?: string[];
  supersedes_key?: string;
  last_indexed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DevTaskContext {
  id: string;
  task_id: string;
  context_version: number;
  prd_reference?: any;
  spec_reference?: any;
  adr_references?: any[];
  applied_rule_keys?: any[];
  applied_skill_keys?: any[];
  applied_pattern_keys?: any[];
  resolved_conflicts?: any;
  assumptions?: any[];
  deviations?: any[];
  target_version_id?: string;
  created_by?: string;
  created_at?: string;
}

export interface DevSystemChange {
  id: string;
  version_tag: string;
  change_type: 'feature' | 'bug' | 'refactor' | 'performance' | 'security' | 'migration' | 'documentation';
  title: string;
  description?: string;
  execution_context_id?: string;
  created_by?: string;
  created_at?: string;
}

export interface DeveloperService {
  getArtifacts: () => Promise<DevArtifact[]>;
  getArtifactByKey: (key: string) => Promise<DevArtifact | null>;
  upsertArtifact: (artifact: Partial<DevArtifact>) => Promise<DevArtifact>;
  getTaskContexts: () => Promise<DevTaskContext[]>;
  createTaskContext: (context: Partial<DevTaskContext>) => Promise<DevTaskContext>;
  getSystemChanges: () => Promise<DevSystemChange[]>;
  createSystemChange: (change: Partial<DevSystemChange>) => Promise<DevSystemChange>;
}
