import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { useOrders } from "@/shared/hooks/useOrders";
import { productService } from "@/entities/product/api";
import type { Product } from "@/entities/product/api";
import { bioService } from "@/entities/bio/api";
import type { Order } from "@/entities/order/api";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ImageUploader } from "@/components/ImageUploader";
import { marketingService } from "@/entities/marketing/api";
import { supabase, isSupabaseConfigured } from "@/shared/api/supabase";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { Loader2, ShoppingBag, X } from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Card } from "@/shared/ui/Card";

interface DashboardProps {
  onNavigateToBioBuilder: () => void;
  onNavigateToBioPublic: (slug: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToBioBuilder, onNavigateToBioPublic }) => {
  const { user, signOut } = useAuth();
  const { getCreatorOrders, getBankSettings, saveBankSettings, simulatePayment } = useOrders();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'sepay' | 'affiliate' | 'ai-content' | 'marketing'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [luanId, setLuanId] = useState('');
  const [isProCheckoutOpen, setIsProCheckoutOpen] = useState(false);

  // Affiliate States
  const [affiliateCode, setAffiliateCode] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');
  const [commissions, setCommissions] = useState<any[]>([]);
  const [clicksCount, setClicksCount] = useState(0); 
  const [affiliateSuccess, setAffiliateSuccess] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // AI Content Creator States
  const [aiTopic, setAiTopic] = useState('');
  const [aiChannel, setAiChannel] = useState('tiktok');
  const [aiTone, setAiTone] = useState('expert');
  const [aiResult, setAiResult] = useState('');
  const [aiApiKey, setAiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // State cho Modal thêm/sửa sản phẩm
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(50000);
  const [prodCover, setProdCover] = useState('');
  const [prodFile, setProdFile] = useState('');
  const [prodType, setProdType] = useState<'digital' | 'physical'>('digital');
  const [prodInventory, setProdInventory] = useState(0);
  const [prodIsUnlimited, setProdIsUnlimited] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // User slug cho link công khai
  const [userSlug, setUserSlug] = useState<string>('');

  // State cho Config SePay
  const [bankCode, setBankCode] = useState('MBBank');
  const [bankAccount, setBankAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [configSuccess, setConfigSuccess] = useState(false);

  // State Simulator
  const [simulatingOrderId, setSimulatingOrderId] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatorStatus, setSimulatorStatus] = useState('');

  // Marketing Automation States
  const [mktFbPageId, setMktFbPageId] = useState('');
  const [mktFbPageToken, setMktFbPageToken] = useState('');
  const [mktIsActive, setMktIsActive] = useState(false);
  const [mktStyle, setMktStyle] = useState('Thuyết phục');
  const [mktTargetProductId, setMktTargetProductId] = useState('');
  const [mktGeminiApiKey, setMktGeminiApiKey] = useState('');
  const [mktLastPostedAt, setMktLastPostedAt] = useState('');
  const [mktSubTab, setMktSubTab] = useState<'autopost' | 'swipe'>('autopost');
  const [mktSaving, setMktSaving] = useState(false);
  const [mktTesting, setMktTesting] = useState(false);
  const [mktTestSuccess, setMktTestSuccess] = useState('');
  const [mktTestError, setMktTestError] = useState('');

  // Load toàn bộ dữ liệu
  const loadDashboardData = async () => {
    if (!user) return;
    if (!hasLoadedOnce.current) {
      setLoading(true);
    }
    try {
      const prods = await productService.getProductsByUserId(user.id);
      setProducts(prods);

      const bio = await bioService.getBioByUserId(user.id);
      if (bio) setUserSlug(bio.slug);

      const ords = await getCreatorOrders(user.id);
      setOrders(ords);

      const config = await getBankSettings(user.id);
      if (config) {
        setBankCode(config.bank_code);
        setBankAccount(config.bank_account);
        setAccountName(config.account_name);
        setApiKey(config.api_key || '');
      }

      // Load dữ liệu Affiliate
      if (isSupabaseConfigured && supabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('affiliate_code, payment_info, plan')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setAffiliateCode(profile.affiliate_code || '');
          setPaymentInfo(profile.payment_info || '');
          setUserPlan((profile.plan || 'free') as any);
        }

        const { data: luanBio } = await supabase
          .from('bio_links')
          .select('user_id')
          .eq('slug', 'luannguyen')
          .maybeSingle();
        if (luanBio) {
          setLuanId(luanBio.user_id);
        }

        const { data: comms } = await supabase
          .from('commissions')
          .select('*, orders(payment_code, amount, status, paid_at, products(name))')
          .eq('affiliate_id', user.id)
          .order('created_at', { ascending: false });
        
        if (comms) {
          setCommissions(comms);
          setClicksCount(comms.length * 15 + 24);
        }

        // Tải cấu hình Marketing Automation
        const mkt = await marketingService.getSettings(user.id);
        if (mkt) {
          setMktFbPageId(mkt.fb_page_id || '');
          setMktFbPageToken(mkt.fb_page_token || '');
          setMktIsActive(mkt.is_active || false);
          setMktStyle(mkt.style || 'Thuyết phục');
          setMktTargetProductId(mkt.target_product_id || '');
          setMktGeminiApiKey(mkt.gemini_api_key || '');
          setMktLastPostedAt(mkt.last_posted_at || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange mx-auto" />
          <p className="text-sm text-white/50">Đang tải dữ liệu Dashboard...</p>
        </div>
      </div>
    );
  }

  // Action handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    if (prodType === 'digital' && !prodFile.trim()) return;

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name: prodName,
          description: prodDesc,
          price: prodPrice,
          cover_image_url: prodCover,
          file_url: prodType === 'digital' ? prodFile : null,
          product_type: prodType,
          inventory_count: prodInventory,
          is_unlimited: prodIsUnlimited,
          weight_grams: 0
        });
      } else {
        await productService.createProduct(user.id, {
          name: prodName,
          description: prodDesc,
          price: prodPrice,
          cover_image_url: prodCover,
          file_url: prodType === 'digital' ? prodFile : null,
          product_type: prodType,
          inventory_count: prodInventory,
          is_unlimited: prodIsUnlimited,
          weight_grams: 0,
          status: 'active'
        });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProdName('');
      setProdDesc('');
      setProdPrice(50000);
      setProdCover('');
      setProdFile('');
      setProdType('digital');
      setProdInventory(0);
      setProdIsUnlimited(true);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdCover(p.cover_image_url);
    setProdFile(p.file_url || '');
    setProdType(p.product_type || 'digital');
    setProdInventory(p.inventory_count || 0);
    setProdIsUnlimited(p.is_unlimited ?? true);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      await productService.deleteProduct(id);
      loadDashboardData();
    }
  };

  const handleSaveBankConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAccount.trim() || !accountName.trim()) return;

    const success = await saveBankSettings(user.id, {
      bank_code: bankCode,
      bank_account: bankAccount.trim(),
      account_name: accountName.toUpperCase().trim(),
      api_key: apiKey.trim()
    });

    if (success) {
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
      loadDashboardData();
    }
  };

  const handleSimulateWebhook = async () => {
    if (!simulatingOrderId) return;
    setIsSimulating(true);
    setSimulatorStatus('');
    try {
      const order = orders.find(o => o.id === simulatingOrderId);
      if (!order) return;

      const success = await simulatePayment(order.payment_code, order.amount);
      if (success) {
        setSimulatorStatus(`Thành công! Đơn hàng ${order.payment_code} đã kích hoạt trạng thái ĐÃ THANH TOÁN.`);
        setSimulatingOrderId('');
        loadDashboardData();
      } else {
        setSimulatorStatus('Mô phỏng thất bại. Có thể đơn đã được thanh toán.');
      }
    } catch (err: any) {
      setSimulatorStatus('Lỗi mô phỏng: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateCode.trim()) return;

    const cleanCode = affiliateCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanCode.length < 3) {
      alert('Mã giới thiệu phải có ít nhất 3 ký tự chữ hoặc số!');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({
            affiliate_code: cleanCode,
            payment_info: paymentInfo.trim()
          })
          .eq('id', user.id);

        if (error) {
          if (error.code === '23505') {
            alert('Mã giới thiệu này đã có người sử dụng. Vui lòng chọn mã khác!');
          } else {
            alert('Lỗi khi lưu thông tin: ' + error.message);
          }
          return;
        }

        setAffiliateSuccess(true);
        setTimeout(() => setAffiliateSuccess(false), 3000);
        loadDashboardData();
      }
    } catch (err: any) {
      console.error(err);
      alert('Lỗi hệ thống: ' + err.message);
    }
  };

  const handleRequestWithdrawal = async () => {
    if (!user) return;
    if (!paymentInfo.trim()) {
      alert('Vui lòng điền thông tin tài khoản ngân hàng nhận tiền trước khi rút!');
      return;
    }
    
    const pendingAmount = commissions
      .filter(c => c.status === 'pending')
      .reduce((acc, c) => acc + Number(c.amount), 0);

    if (pendingAmount < 50000) {
      alert('Số dư hoa hồng chờ duyệt tối thiểu để rút là 50.000đ!');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn gửi yêu cầu rút ${pendingAmount.toLocaleString('vi-VN')}đ về tài khoản ngân hàng:\n${paymentInfo}?`);
    if (!confirmed) return;

    setWithdrawLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('commissions')
          .update({ status: 'requested' })
          .eq('affiliate_id', user.id)
          .eq('status', 'pending');

        if (error) {
          alert('Có lỗi xảy ra: ' + error.message);
          return;
        }

        setWithdrawSuccess(true);
        setTimeout(() => setWithdrawSuccess(false), 5000);
        loadDashboardData();
      }
    } catch (err: any) {
      console.error(err);
      alert('Lỗi hệ thống: ' + err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleSaveMarketingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMktSaving(true);
    try {
      const success = await marketingService.saveSettings(user.id, {
        fb_page_id: mktFbPageId.trim(),
        fb_page_token: mktFbPageToken.trim(),
        is_active: mktIsActive,
        style: mktStyle,
        target_product_id: mktTargetProductId,
        gemini_api_key: mktGeminiApiKey.trim()
      });
      if (success) {
        alert('Đã lưu cấu hình tự động tiếp thị thành công!');
        loadDashboardData();
      }
    } catch (err: any) {
      console.error(err);
      alert('Lỗi lưu cấu hình: ' + err.message);
    } finally {
      setMktSaving(false);
    }
  };

  const handleTestAutoPost = async () => {
    if (!user) return;
    if (!mktFbPageId || !mktFbPageToken) {
      alert('Vui lòng điền đầy đủ Facebook Page ID và Page Access Token trước khi test!');
      return;
    }
    let productName = '';
    let productDesc = '';
    let bioUrl = '';

    if (mktTargetProductId === 'quickbio-platform') {
      productName = 'quickbio-platform';
      productDesc = 'Nền tảng Bio-Link và Cửa hàng sản phẩm số tự động nhận VietQR';
      bioUrl = affiliateCode 
        ? `https://quick-bio-lilac.vercel.app?ref=${affiliateCode}` 
        : `https://quick-bio-lilac.vercel.app`;
    } else {
      const targetProduct = products.find(p => p.id === mktTargetProductId);
      if (!targetProduct) {
        alert('Vui lòng chọn 1 sản phẩm quảng bá để test!');
        return;
      }
      productName = targetProduct.name;
      productDesc = targetProduct.description;
      bioUrl = userSlug ? `https://quick-bio-lilac.vercel.app/b/${userSlug}` : `https://quick-bio-lilac.vercel.app`;
    }

    setMktTesting(true);
    setMktTestSuccess('');
    setMktTestError('');
    try {
      const response = await fetch('/api/autopost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          fb_page_id: mktFbPageId.trim(),
          fb_page_token: mktFbPageToken.trim(),
          style: mktStyle,
          product_name: productName,
          product_desc: productDesc,
          gemini_api_key: mktGeminiApiKey.trim(),
          bio_url: bioUrl
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setMktTestSuccess('Đăng bài test thành công! Xem bài viết mới trên Facebook Page của bạn.');
        loadDashboardData();
      } else {
        setMktTestError(resData.error || resData.message || 'Lỗi không xác định khi test auto-post');
      }
    } catch (err: any) {
      console.error(err);
      setMktTestError('Lỗi kết nối API: ' + err.message);
    } finally {
      setMktTesting(false);
    }
  };

  const handleGenerateAIContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      setAiError('Vui lòng nhập chủ đề / sản phẩm số');
      return;
    }
    if (!aiApiKey.trim()) {
      setAiError('Vui lòng điền Gemini API Key của bạn');
      return;
    }

    setAiGenerating(true);
    setAiError('');
    setAiResult('');

    localStorage.setItem('gemini_api_key', aiApiKey.trim());

    let systemPrompt = '';
    if (aiChannel === 'tiktok') {
      systemPrompt = `Bạn là một chuyên gia sáng tạo kịch bản ngắn (TikTok/Reels/Shorts) triệu view. Hãy viết kịch bản chi tiết 60 giây quảng bá cho chủ đề/sản phẩm: "${aiTopic}". 
Giọng điệu: ${aiTone === 'expert' ? 'Chuyên gia, khoa học' : aiTone === 'funny' ? 'Hài hước, châm biếm, bắt trend' : 'Kịch tính, gây sốc'}.
Định dạng đầu ra phải có:
1. Tiêu đề Hook gây tò mò (3 giây đầu).
2. Kịch bản chi tiết dạng bảng (Giây thứ mấy | Hình ảnh/Góc quay | Lời thoại chi tiết).
3. Lời kêu gọi hành động (CTA) khéo léo để khách hàng nhấn vào link Bio mua sản phẩm.`;
    } else if (aiChannel === 'facebook') {
      systemPrompt = `Bạn là chuyên gia viết bài quảng cáo Facebook Ads chốt sale. Hãy viết bài viết quảng cáo hấp dẫn cho sản phẩm: "${aiTopic}".
Giọng điệu: ${aiTone === 'expert' ? 'Chuyên gia uy tín' : aiTone === 'funny' ? 'Thân thiện, vui vẻ' : 'Thúc giục, tạo sự khan hiếm'}.
Định dạng bài viết theo mô hình AIDA hoặc PAS, kèm tiêu đề giật tít, các icon trực quan, và các hashtag liên quan ở cuối bài.`;
    } else {
      systemPrompt = `Bạn là nhà sản xuất sản phẩm số tài ba. Hãy lên ý tưởng và đề cương chi tiết để tự làm 1 sản phẩm số (Ebook/E-course) liên quan đến chủ đề: "${aiTopic}".
Giọng điệu: ${aiTone === 'expert' ? 'Chuyên sâu, logic' : aiTone === 'funny' ? 'Dễ hiểu, gần gũi' : 'Truyền cảm hứng, thay đổi tư duy'}.
Định dạng đầu ra gồm:
1. Tên sản phẩm số giật tít độc quyền.
2. Cấu trúc 5 chương chi tiết (Mỗi chương ghi rõ nội dung chính cần viết).
3. Gợi ý giá bán và cách định giá để khách mua hàng ngay lập tức.`;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${aiApiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Lỗi gọi API Gemini');
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAiResult(text);
      } else {
        throw new Error('Không nhận được phản hồi từ AI');
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Lỗi không xác định khi kết nối với AI');
    } finally {
      setAiGenerating(false);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');

  const proProductMock: Product = {
    id: '00000000-0000-0000-0000-000000000001',
    user_id: luanId,
    name: '⭐ Nâng cấp tài khoản QuickBio Pro (1 Tháng)',
    description: 'Mở khóa giới hạn: Tạo sản phẩm không giới hạn, Mở khóa toàn bộ theme Glassmorphism cao cấp, Sử dụng AI Content Creator vô hạn, Kích hoạt Affiliate chia sẻ hoa hồng.',
    price: 99000,
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80',
    file_url: 'https://quick-bio-lilac.vercel.app/dashboard',
    status: 'active',
    created_at: '',
    updated_at: ''
  };

  const sharedProps = {
    activeTab,
    setActiveTab,
    user,
    userPlan,
    products,
    orders,
    pendingOrders,
    userSlug,
    signOut,
    onNavigateToBioBuilder,
    onNavigateToBioPublic,
    onProUpgradeClick: () => setIsProCheckoutOpen(true),
    
    // Product handlers
    onAddProductClick: () => {
      if (userPlan === 'free' && products.length >= 1) {
        alert('Tài khoản Free chỉ được tạo tối đa 1 sản phẩm. Vui lòng nâng cấp lên gói PRO để đăng bán không giới hạn!');
        setIsProCheckoutOpen(true);
        return;
      }
      setEditingProduct(null);
      setProdName('');
      setProdDesc('');
      setProdPrice(50000);
      setProdCover('');
      setProdFile('');
      setProdType('digital');
      setProdInventory(0);
      setProdIsUnlimited(true);
      setIsProductModalOpen(true);
    },
    onEditProductClick: handleEditProductClick,
    onDeleteProduct: handleDeleteProduct,

    // Order simulator
    simulatingOrderId,
    onSimulatingOrderIdChange: setSimulatingOrderId,
    onSimulateWebhook: handleSimulateWebhook,
    isSimulating,
    simulatorStatus,

    // Sepay config
    bankCode,
    onBankCodeChange: setBankCode,
    bankAccount,
    onBankAccountChange: setBankAccount,
    accountName,
    onAccountNameChange: setAccountName,
    apiKey,
    onApiKeyChange: setApiKey,
    configSuccess,
    onSaveBankConfig: handleSaveBankConfig,

    // Affiliate config
    clicksCount,
    commissions,
    withdrawLoading,
    withdrawSuccess,
    onRequestWithdrawal: handleRequestWithdrawal,
    affiliateCode,
    onAffiliateCodeChange: setAffiliateCode,
    paymentInfo,
    onPaymentInfoChange: setPaymentInfo,
    affiliateSuccess,
    onSaveAffiliate: handleSaveAffiliate,
    linkCopied,
    onLinkCopiedChange: setLinkCopied,

    // AI Content config
    aiTopic,
    onAiTopicChange: setAiTopic,
    aiChannel,
    onAiChannelChange: setAiChannel,
    aiTone,
    onAiToneChange: setAiTone,
    aiApiKey,
    onAiApiKeyChange: setAiApiKey,
    aiGenerating,
    aiError,
    aiResult,
    onGenerateAIContent: handleGenerateAIContent,

    // Marketing config
    mktFbPageId,
    onMktFbPageIdChange: setMktFbPageId,
    mktTargetProductId,
    onMktTargetProductIdChange: setMktTargetProductId,
    mktFbPageToken,
    onMktFbPageTokenChange: setMktFbPageToken,
    mktStyle,
    onMktStyleChange: setMktStyle,
    mktGeminiApiKey,
    onMktGeminiApiKeyChange: setMktGeminiApiKey,
    mktSaving,
    onSaveMarketingSettings: handleSaveMarketingSettings,
    mktLastPostedAt,
    mktIsActive,
    onMktIsActiveChange: setMktIsActive,
    onTestAutoPost: handleTestAutoPost,
    mktTesting,
    mktTestSuccess,
    mktTestError,
    mktSubTab,
    onMktSubTabChange: setMktSubTab
  };

  return (
    <>
      <DashboardView {...sharedProps} />

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md animate-fade-in relative p-0 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/5 relative z-10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                {editingProduct ? 'Chỉnh sửa sản phẩm số' : 'Thêm sản phẩm số mới'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div>
                <Label className="block mb-1.5">Tên sản phẩm số</Label>
                <Input 
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ví dụ: Ebook hướng dẫn kiếm tiền MMO..."
                  required
                />
              </div>

              <div>
                <Label className="block mb-1.5">Mô tả chi tiết sản phẩm</Label>
                <textarea 
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Mô tả các lợi ích, tài nguyên khách hàng nhận được khi mua file này..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-1.5">Giá bán (VND)</Label>
                  <Input 
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                    min={0}
                    step={1000}
                    required
                  />
                </div>
              </div>
                
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-1.5">Loại sản phẩm</Label>
                  <div className="flex bg-black/20 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setProdType('digital')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${prodType === 'digital' ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
                    >
                      Sản phẩm số
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdType('physical')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${prodType === 'physical' ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
                    >
                      Sản phẩm vật lý
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="block mb-1.5">Ảnh bìa sản phẩm</Label>
                  <ImageUploader 
                    value={prodCover} 
                    onChange={(val) => setProdCover(val)}
                    label="Tải ảnh bìa lên"
                    aspectRatio="video"
                  />
                </div>
              </div>

              {prodType === 'digital' ? (
                <div>
                  <Label className="block mb-1.5">Đường dẫn file (Link tải zip, pdf...)</Label>
                  <Input 
                    type="text"
                    value={prodFile}
                    onChange={(e) => setProdFile(e.target.value)}
                    placeholder="Ví dụ: https://github.com/.../archive/main.zip"
                    required
                  />
                  <span className="text-[10px] text-semantic-muted mt-1 block">Sau khi chuyển khoản thành công, hệ thống tự hiển thị link này để khách tải file.</span>
                </div>
              ) : (
                <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="isUnlimited" 
                      checked={prodIsUnlimited}
                      onChange={(e) => setProdIsUnlimited(e.target.checked)}
                      className="w-4 h-4 rounded bg-black/20 border-white/10 text-brand-orange focus:ring-brand-orange/50 focus:ring-offset-0"
                    />
                    <Label htmlFor="isUnlimited" className="cursor-pointer mb-0">Hàng luôn có sẵn (Vô hạn)</Label>
                  </div>
                  
                  {!prodIsUnlimited && (
                    <div>
                      <Label className="block mb-1.5">Số lượng tồn kho</Label>
                      <Input 
                        type="number"
                        value={prodInventory}
                        onChange={(e) => setProdInventory(parseInt(e.target.value) || 0)}
                        min={0}
                        required={!prodIsUnlimited}
                      />
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full mt-2 h-12 text-md"
              >
                {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {isProCheckoutOpen && (
        <CheckoutModal 
          product={proProductMock} 
          creatorId={luanId} 
          onClose={() => {
            setIsProCheckoutOpen(false);
            loadDashboardData();
          }} 
        />
      )}
    </>
  );
};
export default Dashboard;
