import React, { useState } from 'react';
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { 
  useDevArtifacts, 
  useDevTaskContexts, 
  useDevSystemChanges 
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
  Filter
} from 'lucide-react';

type Tab = 'overview' | 'catalog' | 'tasks' | 'changes';

export const DeveloperControlCenterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  const { data: artifacts, isLoading: loadingArtifacts, mutate: mutateArtifacts } = useDevArtifacts(activeTab === 'overview' || activeTab === 'catalog');
  const { data: tasks, isLoading: loadingTasks, mutate: mutateTasks } = useDevTaskContexts(activeTab === 'overview' || activeTab === 'tasks');
  const { data: changes, isLoading: loadingChanges } = useDevSystemChanges(activeTab === 'overview' || activeTab === 'changes');

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
          <div className="text-xs text-semantic-muted uppercase font-bold tracking-wider relative z-10">Total Artifacts (Rules/Skills)</div>
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

  const renderCatalog = () => {
    const filteredArtifacts = artifacts?.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.stable_key.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileJson className="w-5 h-5 text-brand-orange" />
            <h2 className="text-xl font-extrabold">Artifact Catalog</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-semantic-muted" />
              <input 
                type="text" 
                placeholder="Search rules, skills..."
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
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Type</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Scope</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
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
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          artifact.artifact_type === 'rule' ? 'bg-purple-500/20 text-purple-400' :
                          artifact.artifact_type === 'skill' ? 'bg-brand-orange/20 text-brand-orange' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {artifact.artifact_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {artifact.scope}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          artifact.status === 'active' ? 'bg-semantic-success/20 text-semantic-success' :
                          'bg-semantic-warning/20 text-semantic-warning'
                        }`}>
                          {artifact.status}
                        </span>
                        {artifact.mandatory && (
                          <span className="ml-2 text-[10px] text-semantic-error border border-semantic-error/30 px-1.5 py-0.5 rounded font-bold uppercase">Required</span>
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
                      <td colSpan={5} className="px-6 py-12 text-center text-semantic-muted">
                        <Cpu className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        No artifacts found in registry.
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
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Rules Applied</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Skills Applied</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks?.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground font-bold">{task.task_id}</td>
                    <td className="px-6 py-4 text-xs text-semantic-muted">
                      {task.applied_rule_keys?.length || 0} rules
                    </td>
                    <td className="px-6 py-4 text-xs text-semantic-muted">
                      {task.applied_skill_keys?.length || 0} skills
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

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-muted/30 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-background shadow text-foreground' : 'text-semantic-muted hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-background shadow text-foreground' : 'text-semantic-muted hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Artifact Catalog
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'tasks' ? 'bg-background shadow text-foreground' : 'text-semantic-muted hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Execution Contexts
        </button>
        <button
          onClick={() => setActiveTab('changes')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'changes' ? 'bg-background shadow text-foreground' : 'text-semantic-muted hover:text-foreground hover:bg-muted/50'
          }`}
        >
          System Changes
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'changes' && (
          <div className="p-12 text-center text-semantic-muted animate-in fade-in">
            <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p>System Changes Log will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
