import useSWR from 'swr';
import { supabase, isSupabaseConfigured } from '@/shared/api/supabase';

// Define the fetcher function for SWR
const fetcher = async (userId: string) => {
  if (!isSupabaseConfigured || !supabase || !userId) return null;
  const { data, error } = await supabase.rpc('get_dashboard_data', { p_user_id: userId });
  if (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
  return data;
};

export function useDashboardData(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? userId : null,
    fetcher,
    {
      revalidateOnFocus: false, // Tùy chọn: có muốn tự tải lại khi tab focus không
      dedupingInterval: 60000, // Cache trong 1 phút trước khi deduping
    }
  );

  return {
    dashboardData: data,
    isLoading,
    isError: error,
    mutateDashboard: mutate,
  };
}
