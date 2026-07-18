import { useState, useEffect } from 'react';
import { bioService } from "@/entities/bio/api";
import type { BioLink } from "@/entities/bio/api";
import { productService } from "@/entities/product/api";
import type { Product } from "@/entities/product/api";
import { articleService } from "@/entities/article/api";
import { analyticsService } from "@/entities/analytics/api";
import { useCountdown } from './useCountdown';
import { useSocialProof } from './useSocialProof';

export const usePublicBio = (slug: string) => {
  const [bio, setBio] = useState<BioLink | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // 1. Lưu mã giới thiệu CTV nếu có trên URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('quickbio_referrer', ref.trim());
    }
  }, []);

  // 2. Tải dữ liệu bio, sản phẩm và bài viết từ slug
  useEffect(() => {
    const loadBioData = async () => {
      setLoading(true);
      try {
        const bioData = await bioService.getBioBySlug(slug);
        if (bioData) {
          setBio(bioData);
          
          // Log analytics VIEW event
          analyticsService.logEvent({
            user_id: bioData.user_id,
            event_type: 'VIEW',
          });
          
          // Fetch products and articles concurrently
          const [productsData, articlesData] = await Promise.all([
            productService.getActiveProductsByUserId(bioData.user_id),
            articleService.getPublicArticles(bioData.user_id)
          ]);
          
          setProducts(productsData || []);
          setArticles(articlesData || []);
        }
      } catch (err) {
        console.error('Failed to load public bio:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBioData();
  }, [slug]);

  // 3. Tích hợp sub-hooks cho đếm ngược và social proof
  const { timeLeft, formattedTime } = useCountdown();
  const { showToast, toastData } = useSocialProof(products);

  return {
    bio,
    products,
    articles,
    loading,
    activeProduct,
    setActiveProduct,
    timeLeft,
    formattedTime,
    showToast,
    toastData,
  };
};
