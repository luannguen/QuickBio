export interface ArtifactTriggerCondition {
  task_types?: string[];
  change_sizes?: string[];
  domains?: string[];
  tech_stacks?: string[];
  modules?: string[];
  file_patterns?: string[];
  entity_patterns?: string[];
  requires_database_change?: boolean;
  requires_api_change?: boolean;
  requires_ui_change?: boolean;
  requires_permission_change?: boolean;
  requires_security_review?: boolean;
}

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
  scope: 'global' | 'project' | 'domain' | 'tech_stack' | 'security' | 'module' | 'task';
  status: 'active' | 'deprecated' | 'experimental' | 'archived';
  mandatory: boolean;
  trigger_conditions?: ArtifactTriggerCondition[];
  dependency_keys?: string[];
  conflict_keys?: string[];
  supersedes_key?: string;
  last_indexed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskRuleRef {
  key: string;
  version?: string;
  checksum?: string;
  reason: string;
}

export interface TaskSkillRef {
  key: string;
  version?: string;
  reason: string;
}

export interface DevTaskContext {
  id: string;
  task_id: string;
  context_version: number;
  prd_reference?: { document_id: string; revision: number };
  spec_reference?: { document_id: string; revision: number };
  adr_references?: { document_id: string; revision: number }[];
  applied_rule_keys?: TaskRuleRef[];
  applied_skill_keys?: TaskSkillRef[];
  applied_pattern_keys?: TaskSkillRef[];
  resolved_conflicts?: { artifact_a: string; artifact_b: string; resolution: string }[];
  assumptions?: string[];
  deviations?: string[];
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
