import { supabase } from '@/shared/api/supabase';
import type { Lead } from './api.types';

export const leadService = {
  // Gửi Lead (Dành cho khách trên trang Public Bio)
  submitLead: async (tenantId: string, email: string, blockId?: string): Promise<boolean> => {
    try {
      const newLead = {
        tenant_id: tenantId,
        email,
        block_id: blockId,
        source_url: window.location.href,
        created_at: new Date().toISOString()
      };

      if (!supabase) return false;
      const { error } = await supabase.from('leads').insert([newLead]);
      if (error) {
        console.error('Error submitting lead to Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Submit lead error:', err);
      return false;
    }
  },

  // Lấy danh sách Leads (Dành cho Tenant trong Dashboard)
  getLeadsByTenant: async (tenantId: string): Promise<Lead[]> => {
    try {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching leads:', error);
        return [];
      }
      return data as Lead[];
    } catch (err) {
      console.error('Fetch leads error:', err);
      return [];
    }
  }
};
