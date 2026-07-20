import { supabase } from '@/shared/api/supabase';
import type { DevArtifact, DevSystemChange, DevTaskContext, DeveloperService } from './api.types';

export const realDeveloperService: DeveloperService = {
  getArtifacts: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('dev_artifacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dev_artifacts:', error);
      return [];
    }
    return data as DevArtifact[];
  },

  getArtifactByKey: async (key: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('dev_artifacts')
      .select('*')
      .eq('stable_key', key)
      .single();

    if (error) return null;
    return data as DevArtifact;
  },

  upsertArtifact: async (artifact: Partial<DevArtifact>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from('dev_artifacts')
      .upsert(artifact, { onConflict: 'stable_key' })
      .select()
      .single();

    if (error) throw error;
    return data as DevArtifact;
  },

  getTaskContexts: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('dev_task_contexts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dev_task_contexts:', error);
      return [];
    }
    return data as DevTaskContext[];
  },

  createTaskContext: async (context: Partial<DevTaskContext>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from('dev_task_contexts')
      .insert([context])
      .select()
      .single();

    if (error) throw error;
    return data as DevTaskContext;
  },

  getSystemChanges: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('dev_system_changes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dev_system_changes:', error);
      return [];
    }
    return data as DevSystemChange[];
  },

  createSystemChange: async (change: Partial<DevSystemChange>) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from('dev_system_changes')
      .insert([change])
      .select()
      .single();

    if (error) throw error;
    return data as DevSystemChange;
  }
};
