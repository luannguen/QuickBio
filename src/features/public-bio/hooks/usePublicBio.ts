import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { supabase, isSupabaseConfigured } from '@/shared/api/supabase';
import { analyticsService } from "@/entities/analytics/api";
import type { BioLink } from "@/entities/bio/api";
import type { Product } from "@/entities/product/api";
import { useCountdown } from './useCountdown';
import { useSocialProof } from './useSocialProof';

const fetchPublicBio = async (slug: string) => {
  if (!isSupabaseConfigured || !supabase || !slug) return null;
  const { data, error } = await supabase.rpc('get_public_bio_data', { p_slug: slug });
  if (error) {
    console.error('Error fetching public bio data:', error);
    throw error;
  }
  return data;
};

export const usePublicBio = (slug: string) => {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // 1. Lưu mã giới thiệu CTV nếu có trên URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('quickbio_referrer', ref.trim());
    }
  }, []);

  // 2. Lấy dữ liệu qua SWR và RPC (1 query duy nhất)
  const { data, isLoading } = useSWR(
    slug ? [slug, 'public_bio'] : null,
    () => fetchPublicBio(slug),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const bio: BioLink | null = data?.bio || null;
  const products: Product[] = data?.products || [];
  const articles: any[] = data?.articles || [];
  const [landingPages, setLandingPages] = useState<any[]>([]);

  useEffect(() => {
    if (bio?.user_id) {
      import('@/entities/landing/api').then(({ landingService }) => {
        landingService.getLandingPagesByUserId(bio.user_id)
          .then(res => {
            setLandingPages(res.filter((p: any) => p.status === 'active'));
          })
          .catch(err => console.error("Error loading landing pages for public bio:", err));
      });
    }
  }, [bio?.user_id]);

  // 3. Log view event khi bio được load xong
  useEffect(() => {
    if (bio?.user_id) {
      analyticsService.logEvent({
        user_id: bio.user_id,
        event_type: 'VIEW',
      });
    }
  }, [bio?.user_id]);

  // 4. Tích hợp sub-hooks cho đếm ngược và social proof
  const { timeLeft, formattedTime } = useCountdown();
  const { showToast, toastData } = useSocialProof(products);

  return {
    bio,
    products,
    articles,
    landingPages,
    loading: isLoading,
    activeProduct,
    setActiveProduct,
    timeLeft,
    formattedTime,
    showToast,
    toastData,
  };
};
