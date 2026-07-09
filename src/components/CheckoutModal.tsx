import React, { useState, useEffect, useRef } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { useOrders } from '../hooks/useOrders';
import { useCart } from '../hooks/useCart';
import { Loader2, CheckCircle2, Download, AlertTriangle, X, Sparkles, Lock, Clock } from 'lucide-react';

interface CheckoutModalProps {
  product: Product;
  creatorId: string;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, creatorId, onClose }) => {
  const { createNewOrder, getOrderDetails, getBankSettings, getQrUrl } = useOrders();
  const { customerName, customerEmail, setCustomerInfo } = useCart();
  
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [email, setEmail] = useState(customerEmail);
  const [name, setName] = useState(customerName);
  const [order, setOrder] = useState<any>(null);
  const [bankConfig, setBankConfig] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [validationError, setValidationError] = useState('');
  const [paymentTab, setPaymentTab] = useState<'qr' | 'bank'>('qr');
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [acctCopied, setAcctCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  
  // Promo and Order Bump States
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'none' | 'success' | 'error'>('none');
  const [orderBumpChecked, setOrderBumpChecked] = useState(false);
  const [bumpProduct, setBumpProduct] = useState<Product | null>(null);
  
  const pollingInterval = useRef<any>(null);

  // Countdown effect
  useEffect(() => {
    if (step !== 'qr') return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Load cấu hình ngân hàng khi modal mở
  useEffect(() => {
    const loadBank = async () => {
      const config = await getBankSettings(creatorId);
      setBankConfig(config);
    };
    loadBank();
  }, [creatorId, getBankSettings]);

  // Load các sản phẩm khác của Creator để làm Order Bump
  useEffect(() => {
    const loadCreatorProducts = async () => {
      try {
        const list = await productService.getActiveProductsByUserId(creatorId);
        const others = list.filter(p => p.id !== product.id);
        if (others.length > 0) {
          setBumpProduct(others[0]);
        }
      } catch (err) {
        console.error('Failed to load other products for order bump:', err);
      }
    };
    loadCreatorProducts();
  }, [creatorId, product.id]);

  // Tính toán giá tiền
  const basePrice = product.price;
  const bumpPrice = orderBumpChecked && bumpProduct ? Math.round(bumpProduct.price * 0.5) : 0;
  const subtotal = basePrice + bumpPrice;
  const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
  const finalAmount = subtotal - discountAmount;

  // Xử lý áp mã giảm giá
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;
    
    if (code === 'MMO50') {
      setAppliedDiscount(50);
      setAppliedPromoCode('MMO50');
      setPromoStatus('success');
    } else if (code === 'QUICK20') {
      setAppliedDiscount(20);
      setAppliedPromoCode('QUICK20');
      setPromoStatus('success');
    } else if (code === 'PROMO10') {
      setAppliedDiscount(10);
      setAppliedPromoCode('PROMO10');
      setPromoStatus('success');
    } else {
      setAppliedDiscount(0);
      setAppliedPromoCode('');
      setPromoStatus('error');
    }
  };

  // Dọn dẹp polling khi unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  // Bắt đầu kiểm tra trạng thái thanh toán tự động (Polling)
  const startPolling = (orderId: string) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    
    pollingInterval.current = setInterval(async () => {
      const details = await getOrderDetails(orderId);
      if (details && details.status === 'paid') {
        clearInterval(pollingInterval.current);
        setOrder(details);
        setStep('success');
      }
    }, 3000); // Poll mỗi 3 giây
  };

  // Tạo đơn hàng
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Vui lòng nhập họ tên');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Vui lòng nhập email hợp lệ để nhận sản phẩm');
      return;
    }

    setCustomerInfo(name, email);

    // Sử dụng cấu hình ngân hàng mặc định của Creator hoặc cấu hình Demo
    const activeBank = bankConfig || {
      bank_code: 'MBBank',
      bank_account: '9999999999',
      account_name: 'NGUYEN VAN A'
    };

    const referrer = localStorage.getItem('quickbio_referrer') || undefined;

    const newOrder = await createNewOrder({
      product_id: product.id,
      customer_email: email,
      customer_name: name,
      amount: finalAmount,
      referred_by: referrer
    });

    if (newOrder) {
      setOrder(newOrder);
      // Sinh link VietQR
      const url = getQrUrl(activeBank, finalAmount, newOrder.payment_code);
      setQrUrl(url);
      setStep('qr');
      startPolling(newOrder.id);
    } else {
      setValidationError('Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden border border-white/10 animate-float-slow">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
            {step === 'form' ? 'Thông tin mua hàng' : step === 'qr' ? 'Thanh toán đơn hàng' : 'Thanh toán thành công'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form điền thông tin */}
        {step === 'form' && (
          <form onSubmit={handleCheckout} className="p-6 space-y-4">
            <div className="bg-brand-card/50 p-4 rounded-xl border border-white/5 flex gap-4">
              <img 
                src={product.cover_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&h=100&q=80'} 
                alt={product.name} 
                className="w-20 h-20 object-cover rounded-lg border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{product.name}</h4>
                <p className="text-sm text-white/50 line-clamp-1 mt-1">{product.description}</p>
                <div className="text-brand-orange font-semibold mt-2">
                  {product.price.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Họ và tên của bạn</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên đầy đủ"
                  className="w-full px-4 py-3 rounded-xl text-white glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Email nhận file sản phẩm</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl text-white glass-input"
                />
                <span className="text-[11px] text-white/40 mt-1 block">Chúng tôi sẽ gửi link tải file trực tiếp về email này.</span>
              </div>
            </div>

            {/* Order Bump Card */}
            {bumpProduct && (
              <div className="bg-gradient-to-tr from-brand-orange/10 via-brand-coral/5 to-transparent border border-brand-orange/20 p-4 rounded-xl space-y-2 text-left relative overflow-hidden group">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={orderBumpChecked}
                    onChange={(e) => setOrderBumpChecked(e.target.checked)}
                    className="mt-1 w-4.5 h-4.5 rounded text-brand-orange focus:ring-brand-orange border-white/10 bg-black/40"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-brand-coral text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded animate-pulse">SIÊU ƯU ĐÃI MUA KÈM</span>
                      <span className="text-[10px] text-white/55">Giảm độc quyền 50%</span>
                    </div>
                    <h5 className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">{bumpProduct.name}</h5>
                    <p className="text-[10px] text-white/40 line-clamp-1">{bumpProduct.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-brand-orange font-mono">{Math.round(bumpProduct.price * 0.5).toLocaleString('vi-VN')}đ</span>
                      <span className="text-[9px] text-white/30 line-through font-mono">{bumpProduct.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">Mã giảm giá (Promo Code)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Ví dụ: MMO50, QUICK20..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-white text-xs glass-input"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold rounded-xl transition-all"
                >
                  Áp dụng
                </button>
              </div>
              
              {promoStatus === 'success' && (
                <p className="text-[10px] text-green-400 font-medium">✓ Áp dụng mã giảm giá {appliedPromoCode} thành công! Giảm {appliedDiscount}%</p>
              )}
              {promoStatus === 'error' && (
                <p className="text-[10px] text-red-400 font-medium">✗ Mã giảm giá không hợp lệ</p>
              )}
            </div>

            {/* Total Price breakdown */}
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs space-y-2 text-left">
              <div className="flex justify-between text-white/50">
                <span>Giá sản phẩm chính:</span>
                <span className="font-mono">{product.price.toLocaleString('vi-VN')}đ</span>
              </div>
              {orderBumpChecked && bumpProduct && (
                <div className="flex justify-between text-white/50">
                  <span>Mua kèm: {bumpProduct.name} (Giảm 50%):</span>
                  <span className="font-mono">+{Math.round(bumpProduct.price * 0.5).toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Giảm giá ({appliedPromoCode} -{appliedDiscount}%):</span>
                  <span className="font-mono">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold text-white">
                <span>Tổng số tiền thanh toán:</span>
                <span className="text-brand-orange font-mono">{finalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-orange/20"
            >
              Tiến hành thanh toán
            </button>
          </form>
        )}

        {/* Trang mã QR Thanh toán */}
        {step === 'qr' && order && (
          <div className="p-6 space-y-5 text-center">
            {/* Countdown timer */}
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                Mã thanh toán hết hạn trong:
              </span>
              <span className="font-mono font-black text-brand-orange text-sm animate-pulse">{formatTime(countdown)}</span>
            </div>

            {/* Payment method selector tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
              <button 
                type="button"
                onClick={() => setPaymentTab('qr')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${paymentTab === 'qr' ? 'bg-brand-orange text-white shadow' : 'text-white/40 hover:text-white'}`}
              >
                Quét mã VietQR
              </button>
              <button 
                type="button"
                onClick={() => setPaymentTab('bank')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${paymentTab === 'bank' ? 'bg-brand-orange text-white shadow' : 'text-white/40 hover:text-white'}`}
              >
                Chuyển khoản tay
              </button>
            </div>

            {paymentTab === 'qr' ? (
              <div className="space-y-4">
                <div className="text-[11px] text-white/50">
                  Mở ứng dụng ngân hàng và **Quét mã VietQR** bên dưới:
                </div>
                {/* Mã QR VietQR */}
                <div className="relative mx-auto w-52 h-52 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border border-white/10 group">
                  {qrUrl ? (
                    <img src={qrUrl} alt="VietQR Code" className="w-full h-full object-contain" />
                  ) : (
                    <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                  )}
                </div>

                {qrUrl && (
                  <a 
                    href={qrUrl}
                    download={`ThanhToan_${order.payment_code}.png`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải ảnh QR về máy
                  </a>
                )}
              </div>
            ) : (
              <div className="text-left bg-brand-card/50 p-4 rounded-xl border border-white/5 space-y-3 text-xs leading-relaxed">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Ngân hàng:</span>
                  <span className="font-bold text-white">{bankConfig?.bank_code || 'MBBank'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/50">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wider">{bankConfig?.bank_account || '9999999999'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(bankConfig?.bank_account || '9999999999');
                        setAcctCopied(true);
                        setTimeout(() => setAcctCopied(false), 1500);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${acctCopied ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70 hover:bg-brand-orange'}`}
                    >
                      {acctCopied ? 'Đã copy!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Chủ tài khoản:</span>
                  <span className="font-bold text-white">{bankConfig?.account_name || 'NGUYEN VAN A'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Số tiền:</span>
                  <span className="font-black text-brand-orange">{order.amount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center py-1.5 bg-brand-orange/10 px-2 rounded-lg border border-brand-orange/20">
                  <span className="text-brand-orange font-bold">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-brand-orange tracking-wider">{order.payment_code}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(order.payment_code);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 1500);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${codeCopied ? 'bg-green-500 text-white' : 'bg-brand-orange text-white'}`}
                    >
                      {codeCopied ? 'Đã copy!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Polling loading indicator */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-white/50 animate-pulse pt-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-orange" />
              <span>Đang chờ chuyển khoản (đối soát tự động 3 giây)...</span>
            </div>

            {/* SSL Secure Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-white/30 pt-3 border-t border-white/5">
              <Lock className="w-3.5 h-3.5 text-green-500/80 animate-pulse" />
              <span>Giao dịch mã hóa SSL bảo mật trực tiếp 100%</span>
            </div>
          </div>
        )}

        {/* Màn hình thanh toán thành công */}
        {step === 'success' && order && (
          <div className="p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white">Thanh toán hoàn tất!</h4>
              <p className="text-sm text-white/60">
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận thanh toán tự động qua hệ thống.
              </p>
            </div>

            <div className="bg-brand-card/50 p-4 rounded-xl border border-white/5 text-left space-y-2 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Mã đơn hàng:</span>
                <span className="font-semibold text-white">{order.payment_code}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Sản phẩm:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Gửi đến email:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{order.customer_email}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a 
                href={product.file_url} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/20 text-sm animate-pulse"
              >
                <Download className="w-5 h-5" />
                Tải xuống: {product.name}
              </a>
              {orderBumpChecked && bumpProduct && (
                <a 
                  href={bumpProduct.file_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#8BC34A]/20 text-sm animate-pulse"
                >
                  <Download className="w-5 h-5" />
                  Tải mua kèm: {bumpProduct.name}
                </a>
              )}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-2 text-white/50 hover:text-white text-xs transition-colors pt-2"
            >
              Đóng cửa sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
