import { supabase, isSupabaseConfigured, mockDb } from '@/shared/api/supabase';

export interface Lead {
  id: string;
  tenant_id: string;
  block_id?: string;
  email: string;
  source_url?: string;
  created_at: string;
}

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

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('leads').insert([newLead]);
        if (error) {
          console.error('Error submitting lead to Supabase:', error);
          return false;
        }
        return true;
      } else {
        const leads = mockDb.get('leads') || [];
        mockDb.save('leads', [...leads, { ...newLead, id: crypto.randomUUID() }]);
        return true;
      }
    } catch (err) {
      console.error('Submit lead error:', err);
      return false;
    }
  },

  // Lấy danh sách Leads (Dành cho Tenant trong Dashboard)
  getLeadsByTenant: async (tenantId: string): Promise<Lead[]> => {
    try {
      if (isSupabaseConfigured && supabase) {
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
      } else {
        const leads = mockDb.get('leads') || [];
        return leads
          .filter((l: Lead) => l.tenant_id === tenantId)
          .sort((a: Lead, b: Lead) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    } catch (err) {
      console.error('Fetch leads error:', err);
      return [];
    }
  }
};
