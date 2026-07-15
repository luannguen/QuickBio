import { useState, useEffect } from 'react';
import { bioService } from '../../../services/bioService';
import type { BioLink } from '../../../services/bioService';
import { productService } from '../../../services/productService';
import type { Product } from '../../../services/productService';
import { useCountdown } from './useCountdown';
import { useSocialProof } from './useSocialProof';

export const usePublicBio = (slug: string) => {
  const [bio, setBio] = useState<BioLink | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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

  // 2. Tải dữ liệu bio và sản phẩm từ slug
  useEffect(() => {
    const loadBioData = async () => {
      setLoading(true);
      try {
        const bioData = await bioService.getBioBySlug(slug);
        if (bioData) {
          setBio(bioData);
          const productsData = await productService.getActiveProductsByUserId(bioData.user_id);
          setProducts(productsData);
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
    loading,
    activeProduct,
    setActiveProduct,
    timeLeft,
    formattedTime,
    showToast,
    toastData,
  };
};
