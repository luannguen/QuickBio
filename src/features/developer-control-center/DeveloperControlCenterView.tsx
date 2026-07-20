import React, { useState } from 'react';
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { developerService } from '@/entities/developer/api';
import { 
  useDevArtifacts, 
  useDevTaskContexts, 
  useDevSystemChanges,
  useDevFeatureFlags
} from "@/shared/hooks/useDeveloperSWR";
import { 
  Code2, 
  Terminal, 
  History, 
  GitCommit, 
  FileJson,
  Cpu,
  BrainCircuit,
  Search,
  Filter,
  FileText,
  Layers,
  CheckSquare,
  Package,
  Database,
  AlertTriangle,
  HeartPulse,
  Flag
} from 'lucide-react';

type Tab = 
  | 'overview' 
  | 'prds' | 'specs' | 'adrs'
  | 'rules' | 'skills' | 'patterns'
  | 'tasks' | 'checkpoints' | 'changes' | 'versions' | 'releases' | 'migrations'
  | 'issues' | 'tech_debt' | 'feature_flags';

export const DeveloperControlCenterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // For simplicity, we fetch all artifacts and filter them by type locally.
  const { data: artifacts, isLoading: loadingArtifacts, mutate: mutateArtifacts } = useDevArtifacts();
  const { data: tasks, isLoading: loadingTasks, mutate: mutateTasks } = useDevTaskContexts();
  const { data: changes, isLoading: loadingChanges, mutate: mutateChanges } = useDevSystemChanges();
  const { data: featureFlags, isLoading: loadingFlags, mutate: mutateFlags } = useDevFeatureFlags();

  const [searchQuery, setSearchQuery] = useState('');

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="w-5 h-5 text-brand-orange" />
        <h2 className="text-xl font-extrabold">System Registry Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col gap-2 border-brand-orange/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <div className="text-xs text-semantic-muted uppercase font-bold tracking-wider relative z-10">Total Artifacts</div>
          <div className="text-4xl font-black text-foreground flex items-center gap-3 relative z-10">
            <Code2 className="w-8 h-8 text-brand-orange" />
            {loadingArtifacts ? <Skeleton className="h-10 w-16" /> : artifacts?.length || 0}
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-2 border-semantic-info/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-semantic-info/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <div className="text-xs text-semantic-muted uppercase font-bold tracking-wider relative z-10">AI Task Executions</div>
          <div className="text-4xl font-black text-foreground flex items-center gap-3 relative z-10">
            <Terminal className="w-8 h-8 text-semantic-info" />
            {loadingTasks ? <Skeleton className="h-10 w-16" /> : tasks?.length || 0}
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-2 border-semantic-success/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-semantic-success/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <div className="text-xs text-semantic-muted uppercase font-bold tracking-wider relative z-10">System Releases & Changes</div>
          <div className="text-4xl font-black text-foreground flex items-center gap-3 relative z-10">
            <GitCommit className="w-8 h-8 text-semantic-success" />
            {loadingChanges ? <Skeleton className="h-10 w-16" /> : changes?.length || 0}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCatalog = (artifactType: 'rule' | 'skill' | 'pattern' | 'prd' | 'spec' | 'adr', title: string) => {
    const filteredArtifacts = artifacts?.filter(a => 
      a.artifact_type === artifactType &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       a.stable_key.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileJson className="w-5 h-5 text-brand-orange" />
            <h2 className="text-xl font-extrabold">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-semantic-muted" />
              <input 
                type="text" 
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:border-brand-orange w-64"
              />
            </div>
            <Button onClick={() => mutateArtifacts()} variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-border bg-card/50">
          {loadingArtifacts && (!artifacts || artifacts.length === 0) ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-semantic-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Artifact</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Scope / Status</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Triggers & Dependencies</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredArtifacts.map((artifact) => (
                    <tr key={artifact.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{artifact.name}</div>
                        <div className="text-xs text-semantic-muted font-mono mt-0.5">{artifact.stable_key}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{artifact.scope}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            artifact.status === 'active' ? 'bg-semantic-success/20 text-semantic-success' :
                            'bg-semantic-warning/20 text-semantic-warning'
                          }`}>
                            {artifact.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         {artifact.trigger_conditions && artifact.trigger_conditions.length > 0 ? (
                           <div className="text-[10px] text-semantic-muted font-mono">
                             Has Triggers
                           </div>
                         ) : <span className="text-muted-foreground text-xs">-</span>}
                         {artifact.dependency_keys && artifact.dependency_keys.length > 0 && (
                            <div className="text-[10px] text-semantic-info font-mono mt-1">
                              Deps: {artifact.dependency_keys.length}
                            </div>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-xs font-mono text-semantic-muted truncate max-w-[150px] inline-block" title={artifact.source_path}>
                          {artifact.source_path || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredArtifacts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-semantic-muted">
                        <Cpu className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        No {title.toLowerCase()} found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderTasks = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-semantic-info" />
          <h2 className="text-xl font-extrabold">Task Execution Contexts</h2>
        </div>
        <Button onClick={() => mutateTasks()} variant="outline" size="sm">Refresh</Button>
      </div>

      <Card className="p-0 overflow-hidden border-border bg-card/50">
        {loadingTasks && (!tasks || tasks.length === 0) ? (
          <div className="p-4 space-y-4">
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-semantic-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Task ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Refs (PRD/Spec/ADR)</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Rules/Skills/Patterns</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks?.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground font-bold">{task.task_id}</td>
                    <td className="px-6 py-4 text-xs text-semantic-muted">
                      {task.prd_reference ? '✅ PRD ' : ''}
                      {task.spec_reference ? '✅ Spec ' : ''}
                      {task.adr_references && task.adr_references.length > 0 ? `✅ ${task.adr_references.length} ADRs` : ''}
                    </td>
                    <td className="px-6 py-4 text-xs text-semantic-muted">
                      {task.applied_rule_keys?.length || 0}R / {task.applied_skill_keys?.length || 0}S / {task.applied_pattern_keys?.length || 0}P
                    </td>
                    <td className="px-6 py-4 text-xs text-right text-semantic-muted">
                      {task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {(!tasks || tasks.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-semantic-muted">
                      <Terminal className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      No execution contexts logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderChanges = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-semantic-warning" />
          <h2 className="text-xl font-extrabold">System Changes Log</h2>
        </div>
        <Button onClick={() => mutateChanges()} variant="outline" size="sm">Refresh</Button>
      </div>

      <Card className="p-0 overflow-hidden border-border bg-card/50">
        {loadingChanges && (!changes || changes.length === 0) ? (
          <div className="p-4 space-y-4">
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-semantic-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Version & Title</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Task Context</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {changes?.map((change) => (
                  <tr key={change.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-foreground text-base">{change.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                            {change.version_tag}
                          </span>
                          <span className="text-xs text-semantic-muted truncate max-w-sm" title={change.description}>
                            {change.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        change.change_type === 'feature' ? 'bg-semantic-success/20 text-semantic-success' :
                        change.change_type === 'bug' ? 'bg-semantic-error/20 text-semantic-error' :
                        change.change_type === 'refactor' ? 'bg-semantic-warning/20 text-semantic-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {change.change_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-semantic-muted">
                      {change.execution_context_id ? change.execution_context_id.split('-')[0] + '...' : 'Manual'}
                    </td>
                    <td className="px-6 py-4 text-xs text-right text-semantic-muted">
                      {change.created_at ? new Date(change.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {(!changes || changes.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-semantic-muted">
                      <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      No system changes logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderCheckpoints = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-brand-orange" />
          <h2 className="text-xl font-extrabold">Execution Checkpoints</h2>
        </div>
        <Button onClick={() => mutateTasks()} variant="outline" size="sm">Refresh</Button>
      </div>

      <Card className="p-0 overflow-hidden border-border bg-card/50">
        {loadingTasks && (!tasks || tasks.length === 0) ? (
          <div className="p-4 space-y-4">
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-semantic-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Checkpoint & Task</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">References (PRD/Spec/ADR)</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Rules / Skills / Patterns</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks?.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-foreground text-sm">
                          {task.assumptions && task.assumptions.length > 0 ? task.assumptions.join(", ") : 'Checkpoint'}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground border border-border">
                            {task.task_id}
                          </span>
                          <span className="text-[10px] font-mono text-semantic-muted truncate max-w-[120px]">
                            {task.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-semantic-muted">
                      <div className="flex flex-col gap-1">
                        {task.prd_reference && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                            <span>PRD: {task.prd_reference.document_id}</span>
                          </div>
                        )}
                        {task.spec_reference && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-semantic-info" />
                            <span>Spec: {task.spec_reference.document_id}</span>
                          </div>
                        )}
                        {task.adr_references && task.adr_references.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                            <span>ADRs: {task.adr_references.map(a => a.document_id).join(", ")}</span>
                          </div>
                        )}
                        {!task.prd_reference && !task.spec_reference && (!task.adr_references || task.adr_references.length === 0) && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {task.applied_rule_keys?.map((r, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-orange/10 text-brand-orange border border-brand-orange/20" title={r.reason}>
                            {r.key}
                          </span>
                        ))}
                        {task.applied_skill_keys?.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-semantic-info/10 text-semantic-info border border-semantic-info/20" title={s.reason}>
                            {s.key}
                          </span>
                        ))}
                        {task.applied_pattern_keys?.map((p, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-semantic-success/10 text-semantic-success border border-semantic-success/20" title={p.reason}>
                            {p.key}
                          </span>
                        ))}
                        {(!task.applied_rule_keys || task.applied_rule_keys.length === 0) &&
                         (!task.applied_skill_keys || task.applied_skill_keys.length === 0) &&
                         (!task.applied_pattern_keys || task.applied_pattern_keys.length === 0) && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-right text-semantic-muted">
                      {task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {(!tasks || tasks.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-semantic-muted">
                      <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      No checkpoints logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const handleToggleFlag = async (id: string, isEnabled: boolean) => {
    try {
      await developerService.toggleFeatureFlag(id, isEnabled);
      mutateFlags();
    } catch (err) {
      console.error("Failed to toggle flag:", err);
    }
  };

  const renderFeatureFlags = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flag className="w-5 h-5 text-brand-orange" />
          <h2 className="text-xl font-extrabold">Feature Flags</h2>
        </div>
        <Button onClick={() => mutateFlags()} variant="outline" size="sm">Refresh</Button>
      </div>

      <Card className="p-0 overflow-hidden border-border bg-card/50">
        {loadingFlags && (!featureFlags || featureFlags.length === 0) ? (
          <div className="p-4 space-y-4">
             {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-semantic-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Flag Key & Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Description</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {featureFlags?.map((flag) => (
                  <tr key={flag.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-foreground text-sm">{flag.name}</div>
                        <div className="font-mono text-xs text-semantic-muted">{flag.flag_key}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-semantic-muted">
                      {flag.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        flag.is_enabled ? 'bg-semantic-success/20 text-semantic-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {flag.is_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleFlag(flag.id, !flag.is_enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          flag.is_enabled ? 'bg-brand-orange' : 'bg-muted border border-border'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            flag.is_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
                {(!featureFlags || featureFlags.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-semantic-muted">
                      <Flag className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      No feature flags configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderComingSoon = (title: string, icon: React.ReactNode) => (
    <div className="p-12 text-center text-semantic-muted animate-in fade-in">
      <div className="flex justify-center mb-4 opacity-20">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p>This module is planned for the next iteration of the Developer Control Center.</p>
    </div>
  );

  const sidebarGroups = [
    {
      title: "Dashboard",
      items: [
        { id: 'overview', label: 'Overview', icon: <BrainCircuit className="w-4 h-4" /> }
      ]
    },
    {
      title: "Documentation",
      items: [
        { id: 'prds', label: 'PRDs', icon: <FileText className="w-4 h-4" /> },
        { id: 'specs', label: 'Specifications', icon: <FileJson className="w-4 h-4" /> },
        { id: 'adrs', label: 'Architecture Decisions', icon: <Layers className="w-4 h-4" /> },
      ]
    },
    {
      title: "Artifact Catalogs",
      items: [
        { id: 'rules', label: 'Rule Catalog', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'skills', label: 'Skill Catalog', icon: <Terminal className="w-4 h-4" /> },
        { id: 'patterns', label: 'Pattern Catalog', icon: <Code2 className="w-4 h-4" /> },
      ]
    },
    {
      title: "Execution & Releases",
      items: [
        { id: 'tasks', label: 'Execution Contexts', icon: <Terminal className="w-4 h-4" /> },
        { id: 'checkpoints', label: 'Checkpoints', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'changes', label: 'System Changes', icon: <History className="w-4 h-4" /> },
        { id: 'versions', label: 'Versions', icon: <Package className="w-4 h-4" /> },
        { id: 'releases', label: 'Releases', icon: <GitCommit className="w-4 h-4" /> },
        { id: 'migrations', label: 'Migrations', icon: <Database className="w-4 h-4" /> },
      ]
    },
    {
      title: "System Health & Governance",
      items: [
        { id: 'issues', label: 'Known Issues', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'tech_debt', label: 'Technical Debt', icon: <HeartPulse className="w-4 h-4" /> },
        { id: 'feature_flags', label: 'Feature Flags', icon: <Flag className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="flex h-full bg-background rounded-xl border border-border overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/10 overflow-y-auto">
        <div className="p-4 space-y-6">
          {sidebarGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-semantic-muted uppercase tracking-wider mb-2 px-2">
                {group.title}
              </h4>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      activeTab === item.id 
                        ? 'bg-brand-orange/10 text-brand-orange font-bold' 
                        : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className={activeTab === item.id ? "text-brand-orange" : "text-semantic-muted"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-background/50">
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'rules' && renderCatalog('rule', 'Rule Catalog')}
        {activeTab === 'skills' && renderCatalog('skill', 'Skill Catalog')}
        {activeTab === 'patterns' && renderCatalog('pattern', 'Pattern Catalog')}
        
        {activeTab === 'tasks' && renderTasks()}
        
        {activeTab === 'changes' && renderChanges()}
        {activeTab === 'checkpoints' && renderCheckpoints()}
        {activeTab === 'feature_flags' && renderFeatureFlags()}
        
        {activeTab === 'prds' && renderCatalog('prd', 'PRDs')}
        {activeTab === 'specs' && renderCatalog('spec', 'Specifications')}
        {activeTab === 'adrs' && renderCatalog('adr', 'Architecture Decisions')}
        
        {(
          activeTab === 'versions' || 
          activeTab === 'releases' || activeTab === 'migrations' || activeTab === 'issues' || 
          activeTab === 'tech_debt'
        ) && renderComingSoon(
          sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Module', 
          sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.icon || <History className="w-8 h-8" />
        )}
      </div>
    </div>
  );
};
