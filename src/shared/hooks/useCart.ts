import { useCartStore } from './store';

export const useCart = () => {
  const {
    isOpen,
    selectedProduct,
    customerName,
    customerEmail,
    openCart,
    closeCart,
    setCustomerInfo,
    resetCart
  } = useCartStore();

  return {
    isOpen,
    product: selectedProduct,
    customerName,
    customerEmail,
    openCart,
    closeCart,
    setCustomerInfo,
    resetCart
  };
};
export default useCart;
