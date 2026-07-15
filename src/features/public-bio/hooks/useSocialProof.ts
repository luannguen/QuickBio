import { useState, useEffect } from 'react';
import type { Product } from '../../../services/productService';

export const useSocialProof = (products: Product[]) => {
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ name: '', product: '', time: '' });

  useEffect(() => {
    if (products.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const triggerToast = () => {
      const names = ['Tuấn***', 'Lê Hương***', 'Nguyễn***', 'Tran***', 'Phạm Hoàng***', 'Vũ***', 'Bùi Ngọc***'];
      const times = ['vừa xong', '1 phút trước', '2 phút trước', '4 phút trước'];

      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)].name;

      setToastData({ name: randomName, product: randomProduct, time: randomTime });
      setShowToast(true);

      // Auto hide toast after 4.5s
      setTimeout(() => setShowToast(false), 4500);

      // Schedule next toast (between 20s and 45s)
      const nextTime = Math.floor(Math.random() * (45000 - 20000 + 1) + 20000);
      timeoutId = setTimeout(triggerToast, nextTime);
    };

    // Initial trigger after 3s
    timeoutId = setTimeout(triggerToast, 3000);
    return () => clearTimeout(timeoutId);
  }, [products]);

  return { showToast, toastData };
};
