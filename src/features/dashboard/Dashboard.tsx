import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { productService } from '../../services/productService';
import type { Product } from '../../services/productService';
import { bioService } from '../../services/bioService';
import type { Order } from '../../services/orderService';
import { CheckoutModal } from '../../components/CheckoutModal';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  ShoppingBag, 
  Settings, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Eye, 
  BookOpen, 
  Key, 
  Info,
  ExternalLink,
  Loader2,
  Users,
  Copy,
  AlertTriangle
} from 'lucide-react';

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
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [luanId, setLuanId] = useState('');
  const [isProCheckoutOpen, setIsProCheckoutOpen] = useState(false);

  // Affiliate States
  const [affiliateCode, setAffiliateCode] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');
  const [commissions, setCommissions] = useState<any[]>([]);
  const [clicksCount, setClicksCount] = useState(0); // Mock click tracking for stats
  const [affiliateSuccess, setAffiliateSuccess] = useState(false);

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

  // Load toàn bộ dữ liệu
  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
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
      const { supabase, isSupabaseConfigured } = await import('../../services/supabase');
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
          setClicksCount(comms.length * 15 + 24); // Giả lập số lượt click để CTV thấy trực quan
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  // Tính toán số liệu thống kê
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalOrders = orders.filter(o => o.status === 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending');

  // Xử lý lưu/sửa sản phẩm
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodFile.trim()) return;

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name: prodName,
          description: prodDesc,
          price: prodPrice,
          cover_image_url: prodCover,
          file_url: prodFile
        });
      } else {
        await productService.createProduct(user.id, {
          name: prodName,
          description: prodDesc,
          price: prodPrice,
          cover_image_url: prodCover,
          file_url: prodFile,
          status: 'active'
        });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      // Reset form
      setProdName('');
      setProdDesc('');
      setProdPrice(50000);
      setProdCover('');
      setProdFile('');
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
    setProdFile(p.file_url);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      await productService.deleteProduct(id);
      loadDashboardData();
    }
  };

  // Xử lý lưu Config SePay/Ngân hàng
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

  // Giả lập webhook ngân hàng thành công
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

  // Xử lý lưu Affiliate
  const handleSaveAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateCode.trim()) return;

    // Chỉ cho phép chữ và số, không khoảng trắng
    const cleanCode = affiliateCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanCode.length < 3) {
      alert('Mã giới thiệu phải có ít nhất 3 ký tự chữ hoặc số!');
      return;
    }

    try {
      const { supabase, isSupabaseConfigured } = await import('../../services/supabase');
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

  // Xử lý tạo nội dung bằng Gemini AI
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

    // Cấu hình prompt chi tiết
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

  return (
    <div className="min-h-screen bg-[#080B11] text-white">
      {/* Top Banner Dashboard */}
      <header className="border-b border-white/5 bg-brand-card/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">QuickBio Console</h1>
              <p className="text-xs text-white/50">Quản lý cửa hàng sản phẩm số & Bio-Link của bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={onNavigateToBioBuilder}
              className="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 touch-target"
            >
              Thiết kế Bio Link
            </button>
            <button 
              onClick={() => onNavigateToBioPublic(userSlug || 'luannguyen')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 touch-target"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem trang Bio công khai
            </button>
            <button 
              onClick={signOut}
              className="px-3 py-2 text-white/40 hover:text-white text-xs font-semibold transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* User profile card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <img 
              src={user.avatar_url} 
              alt={user.full_name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white/15"
            />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Chào, {user.full_name}!
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  userPlan === 'pro'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 font-bold'
                    : 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange'
                }`}>
                  {userPlan === 'pro' ? 'QuickBio Pro' : 'QuickBio Free'}
                </span>
              </h2>
              <p className="text-xs text-white/40 mt-1">{user.email}</p>
            </div>
          </div>
          {userPlan === 'free' ? (
            <div className="bg-brand-orange/10 px-5 py-4 rounded-xl border border-brand-orange/20 text-xs text-white/90 max-w-lg leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                🚀 <strong>Gói Free giới hạn (1 Sản phẩm, Không AI):</strong> Nâng cấp gói Pro để mở rộng sản phẩm không giới hạn, kích hoạt AI viết content tự động.
              </div>
              <button 
                onClick={() => setIsProCheckoutOpen(true)}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-coral text-white font-bold rounded-lg transition-colors flex-shrink-0 touch-target"
              >
                Nâng cấp Pro 99k
              </button>
            </div>
          ) : (
            <div className="bg-green-500/5 px-5 py-4 rounded-xl border border-green-500/10 text-xs text-white/70 max-w-md leading-relaxed text-center sm:text-left">
              🎉 <strong>Tài khoản Pro:</strong> Bạn đang sở hữu toàn bộ các quyền năng nâng cao nhất (AI Content, Affiliate, Không giới hạn sản phẩm).
            </div>
          )}
        </div>

        {/* Analytics Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-24 h-24 bg-brand-orange/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
              <DollarSign className="w-5 h-5 text-brand-orange" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalRevenue.toLocaleString('vi-VN')} <span className="text-lg font-medium text-brand-orange">VND</span>
            </div>
            <p className="text-[10px] text-white/30">Dòng tiền chảy thẳng về tài khoản ngân hàng của bạn.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Đơn hàng thành công</span>
              <ShoppingBag className="w-5 h-5 text-brand-green" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalOrders} <span className="text-lg font-medium text-white/50">đơn</span>
            </div>
            <p className="text-[10px] text-white/30">Mở khóa link tải file và tự động gửi mail thành công.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Sản phẩm đang bán</span>
              <BookOpen className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {products.length} <span className="text-lg font-medium text-white/50">mục</span>
            </div>
            <p className="text-[10px] text-white/30">Quản lý và cập nhật dễ dàng mọi lúc.</p>
          </div>

        </div>

        {/* Tab & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Side Tabs navigation */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { name: 'Quản lý Sản phẩm', id: 'products', count: products.length },
              { name: 'Đơn hàng mua bán', id: 'orders', count: orders.length },
              { name: 'Cấu hình VietQR & Ngân hàng', id: 'sepay' },
              { name: 'Kiếm tiền (Affiliate)', id: 'affiliate', count: commissions.length > 0 ? commissions.length : undefined },
              { name: 'Sáng tạo AI (Gemini)', id: 'ai-content' },
              { name: 'Thư viện Tiếp thị (Marketing Hub)', id: 'marketing' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-4 py-3.5 rounded-xl text-left text-xs font-bold flex items-center justify-between border transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-brand-orange/15 to-brand-coral/5 border-brand-orange/30 text-brand-orange' 
                    : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                    activeTab === tab.id ? 'bg-brand-orange/20 text-brand-orange' : 'bg-white/5 text-white/40'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}

            {/* Simulating webhook section in side column */}
            {pendingOrders.length > 0 && (
              <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/10 mt-6 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
                  Mô phỏng ngân hàng
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Có {pendingOrders.length} đơn hàng đang chờ thanh toán. Bạn có muốn kích hoạt webhook giả lập biến động số dư MBBank báo có?
                </p>
                <div className="space-y-2">
                  <select
                    value={simulatingOrderId}
                    onChange={(e) => setSimulatingOrderId(e.target.value)}
                    className="w-full px-2 py-2 text-[10px] rounded-lg bg-[#080B11] border border-white/10 text-white outline-none"
                  >
                    <option value="">-- Chọn đơn hàng test --</option>
                    {pendingOrders.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.payment_code} - {(o.product?.name || '').slice(0, 15)}...
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSimulateWebhook}
                    disabled={isSimulating || !simulatingOrderId}
                    className="w-full py-2 bg-brand-orange hover:bg-brand-coral disabled:bg-white/5 text-white disabled:text-white/30 text-[10px] font-bold rounded-lg transition-all"
                  >
                    {isSimulating ? 'Đang gửi...' : 'Nhấn giả lập MBBank báo có'}
                  </button>
                </div>
                {simulatorStatus && (
                  <p className="text-[9px] text-green-400 font-medium leading-normal animate-pulse bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                    {simulatorStatus}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Main content pane */}
          <div className="lg:col-span-3">
            
            {/* TAB 1: PRODUCT MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-orange" />
                    Danh sách sản phẩm số
                  </h3>
                  <button 
                    onClick={() => {
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
                      setIsProductModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md touch-target"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Chưa có sản phẩm số nào</h4>
                      <p className="text-xs text-white/40">Hãy tạo sản phẩm số đầu tiên (template, ebook...) để bán lấy doanh thu.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4">
                        <div className="flex gap-4">
                          <img 
                            src={p.cover_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&h=100&q=80'} 
                            alt={p.name} 
                            className="w-16 h-16 object-cover rounded-xl border border-white/15"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-white truncate">{p.name}</h4>
                            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mt-1">{p.description}</p>
                            <span className="text-[10px] mt-2 inline-block font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                              {p.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <span className="text-[10px] text-white/30 truncate max-w-[150px]">File: {p.file_url.slice(0, 20)}...</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(p.file_url, '_blank')}
                              className="px-2.5 py-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 hover:border-brand-orange/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                              title="Xem trước File Sản phẩm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Xem File
                            </button>
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="px-2.5 py-1.5 hover:bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold rounded-lg transition-colors"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-orange" />
                  Đơn hàng mua bán
                </h3>

                {orders.length === 0 ? (
                  <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Chưa có đơn hàng nào</h4>
                      <p className="text-xs text-white/40">Khi có người click mua sản phẩm và quét mã QR chuyển khoản, đơn hàng sẽ hiển thị tại đây.</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-white/5 bg-brand-card/10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01] text-white/60 font-semibold">
                          <th className="p-4">Khách hàng</th>
                          <th className="p-4">Sản phẩm</th>
                          <th className="p-4">Mã CK</th>
                          <th className="p-4">Số tiền</th>
                          <th className="p-4">Thời gian</th>
                          <th className="p-4">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-white">{o.customer_name}</div>
                              <div className="text-[10px] text-white/40 mt-0.5">{o.customer_email}</div>
                            </td>
                            <td className="p-4 truncate max-w-[150px] font-medium text-white">{o.product?.name || 'Sản phẩm đã bị xóa'}</td>
                            <td className="p-4"><span className="font-mono text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-1.5 py-0.5 rounded font-bold">{o.payment_code}</span></td>
                            <td className="p-4 font-bold text-white">{o.amount.toLocaleString('vi-VN')}đ</td>
                            <td className="p-4 text-white/50">{new Date(o.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                o.status === 'paid' 
                                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              }`}>
                                {o.status === 'paid' ? 'Đã nhận tiền' : 'Đang chờ'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SEPAY CONFIGURATION */}
            {activeTab === 'sepay' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-orange" />
                  Cấu hình Cổng thanh toán VietQR & Ngân hàng
                </h3>

                <form onSubmit={handleSaveBankConfig} className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
                  
                  {configSuccess && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Lưu cấu hình ngân hàng thành công!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Ngân hàng thụ hưởng</label>
                      <select 
                        value={bankCode}
                        onChange={(e) => setBankCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs text-white bg-[#080B11] border border-white/10 outline-none focus:border-brand-orange/40"
                      >
                        <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
                        <option value="Vietcombank">Vietcombank (VCB)</option>
                        <option value="Techcombank">Techcombank (TCB)</option>
                        <option value="Viettinbank">Vietinbank</option>
                        <option value="ACB">ACB</option>
                        <option value="VPBank">VPBank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Số tài khoản ngân hàng</label>
                      <input 
                        type="text" 
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Ví dụ: 9999999999"
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Họ và Tên chủ tài khoản (Viết hoa không dấu)</label>
                      <input 
                        type="text" 
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                        placeholder="NGUYEN VAN A"
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-brand-orange" />
                        SePay Webhook API Key
                      </label>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Để trống nếu muốn dùng Webhook Simulator"
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-card/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-brand-orange" />
                      Hướng dẫn nhận tiền tự động bằng SePay (Miễn phí):
                    </h4>
                    <ol className="text-[11px] text-white/50 list-decimal pl-4 space-y-1.5 leading-relaxed">
                      <li>Truy cập <a href="https://sepay.vn" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline flex-inline items-center gap-0.5">SePay.vn <ExternalLink className="w-3 h-3 inline" /></a> và đăng ký tài khoản (Free).</li>
                      <li>Liên kết tài khoản ngân hàng của bạn vào SePay.</li>
                      <li>Tạo Webhook trong SePay, trỏ URL webhook về: <code className="text-brand-orange bg-white/5 px-1 py-0.5 rounded select-all font-mono">https://quickbio.vercel.app/api/webhook</code></li>
                      <li>Copy API Key SePay và dán vào ô bên trên để xác thực giao dịch an toàn.</li>
                    </ol>
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 transform active:scale-95 touch-target"
                  >
                    Lưu cấu hình
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: AFFILIATE SYSTEM */}
            {activeTab === 'affiliate' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-orange" />
                  Hệ thống Tiếp thị liên kết (Affiliate Program)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Tổng lượt Click</span>
                    <div className="text-2xl font-bold text-white">{clicksCount}</div>
                    <p className="text-[9px] text-white/30">Lượt truy cập thông qua link giới thiệu</p>
                  </div>
                  <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Hoa hồng chờ duyệt</span>
                    <div className="text-2xl font-bold text-yellow-500">
                      {commissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + Number(c.amount), 0).toLocaleString('vi-VN')}đ
                    </div>
                    <p className="text-[9px] text-white/30">Hoa hồng phát sinh từ các đơn thành công</p>
                  </div>
                  <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Hoa hồng đã nhận</span>
                    <div className="text-2xl font-bold text-green-500">
                      {commissions.filter(c => c.status === 'paid').reduce((acc, c) => acc + Number(c.amount), 0).toLocaleString('vi-VN')}đ
                    </div>
                    <p className="text-[9px] text-white/30">Đã chuyển khoản thanh toán cho bạn</p>
                  </div>
                </div>

                <form onSubmit={handleSaveAffiliate} className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
                  {affiliateSuccess && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Lưu thông tin Affiliate thành công!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Mã giới thiệu độc quyền (Viết liền, chữ thường hoặc số)</label>
                      <input 
                        type="text" 
                        value={affiliateCode}
                        onChange={(e) => setAffiliateCode(e.target.value)}
                        placeholder="Ví dụ: luannguyen, mmo99"
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Thông tin tài khoản ngân hàng của bạn để nhận hoa hồng</label>
                      <input 
                        type="text" 
                        value={paymentInfo}
                        onChange={(e) => setPaymentInfo(e.target.value)}
                        placeholder="Ví dụ: MBBank - 0912345678 - NGUYEN VAN A"
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                        required
                      />
                    </div>
                  </div>

                  {affiliateCode && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Đường dẫn giới thiệu của bạn:</span>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          readOnly 
                          value={`${window.location.origin}/${userSlug || 'luannguyen'}?ref=${affiliateCode}`}
                          className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-brand-orange outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/${userSlug || 'luannguyen'}?ref=${affiliateCode}`);
                            alert('Đã copy link giới thiệu!');
                          }}
                          className="p-2 bg-brand-orange hover:bg-brand-coral rounded-lg transition-colors text-white"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[9px] text-white/30 block">
                        Khi đối tác mang link này đi quảng bá, bất kỳ khách hàng nào mua sản phẩm số trên Bio của bạn, đối tác sẽ nhận được 50% hoa hồng chốt sale!
                      </span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 touch-target"
                  >
                    Kích hoạt & Lưu Affiliate
                  </button>
                </form>

                {/* Danh sách đơn hàng giới thiệu */}
                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Danh sách đơn hàng CTV bán hộ</h4>
                  {commissions.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-4">Chưa phát sinh đơn hàng giới thiệu nào.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-white/70">
                        <thead className="text-[10px] text-white/40 uppercase border-b border-white/5 bg-white/5 font-mono">
                          <tr>
                            <th className="px-4 py-3">Mã ĐH</th>
                            <th className="px-4 py-3">Sản phẩm</th>
                            <th className="px-4 py-3">Doanh số</th>
                            <th className="px-4 py-3">Hoa hồng chia sẻ (50%)</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Ngày phát sinh</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissions.map((c, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                              <td className="px-4 py-3 font-mono text-brand-orange">{c.orders?.payment_code}</td>
                              <td className="px-4 py-3 truncate max-w-[150px]">{c.orders?.products?.name}</td>
                              <td className="px-4 py-3">{Number(c.orders?.amount).toLocaleString()}đ</td>
                              <td className="px-4 py-3 text-brand-orange font-bold">{Number(c.amount).toLocaleString()}đ</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  c.orders?.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                  {c.orders?.status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white/40">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: AI CONTENT CREATOR */}
            {activeTab === 'ai-content' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                  Sáng tạo Content Tự động bằng Gemini AI (Pro)
                </h3>

                {userPlan !== 'pro' ? (
                  <div className="glass-card p-8 rounded-2xl border border-white/5 text-center space-y-5 max-w-xl mx-auto py-12">
                    <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mx-auto border border-brand-orange/20">
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white">⭐ Tính năng độc quyền của QuickBio PRO</h4>
                      <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
                        Gói PRO cho phép bạn sử dụng AI viết kịch bản TikTok 60s, viết bài bán hàng Facebook chốt sale cực đỉnh chỉ trong 1 giây mà không cần tự suy nghĩ.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsProCheckoutOpen(true)}
                      className="px-6 py-3 bg-brand-orange hover:bg-brand-coral text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 touch-target"
                    >
                      Nâng cấp gói PRO chỉ 99k/tháng
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleGenerateAIContent} className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
                  {aiError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {aiError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Chủ đề / Tên sản phẩm cần viết</label>
                      <input 
                        type="text" 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="Ví dụ: Ebook dạy bán hàng Shopee, prompt chatgpt..."
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2 flex items-center justify-between">
                        <span>Google Gemini API Key</span>
                        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-orange underline">Lấy API Key Miễn Phí Tại Đây ↗</a>
                      </label>
                      <input 
                        type="password" 
                        value={aiApiKey}
                        onChange={(e) => setAiApiKey(e.target.value)}
                        placeholder="Nhập API Key Gemini để sinh kịch bản"
                        className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Định dạng nội dung</label>
                      <select 
                        value={aiChannel}
                        onChange={(e) => setAiChannel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs text-white bg-[#080B11] border border-white/10 outline-none focus:border-brand-orange/40"
                      >
                        <option value="tiktok">Kịch bản Video ngắn (TikTok/Reels/Shorts 60s)</option>
                        <option value="facebook">Bài viết quảng cáo Facebook chốt sale (AIDA/PAS)</option>
                        <option value="product">Lập đề cương chi tiết sản phẩm số để tự bán</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 font-semibold mb-2">Giọng điệu (Tone)</label>
                      <select 
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs text-white bg-[#080B11] border border-white/10 outline-none focus:border-brand-orange/40"
                      >
                        <option value="expert">Chuyên gia uy tín, chuyên sâu</option>
                        <option value="funny">Hài hước, gần gũi, bắt trend</option>
                        <option value="dramatic">Gây sốc, tạo sự thúc giục</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={aiGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 touch-target"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tạo nội dung bằng AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Sinh nội dung ngay
                      </>
                    )}
                  </button>
                </form>

                {aiResult && (
                  <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kết quả từ AI:</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiResult);
                          alert('Đã copy nội dung vào bộ nhớ tạm!');
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy nội dung
                      </button>
                    </div>
                    <div className="bg-[#080B11] p-5 rounded-xl border border-white/5 text-xs text-white/80 leading-relaxed font-mono whitespace-pre-wrap select-all">
                      {aiResult}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {/* TAB 6: MARKETING HUB */}
        {activeTab === 'marketing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-brand-orange" />
                      Thư viện Content Tiếp thị (Marketing Hub)
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Copy kịch bản bán hàng và đăng mạng xã hội để kiếm đơn hàng ngay lập tức.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Ebook Prompt ChatGPT */}
                  <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center border border-brand-orange/20">
                        <Sparkles className="w-5 h-5 text-brand-orange" />
                      </div>
                      <h4 className="font-bold text-sm text-white">Ebook: 100+ Prompt ChatGPT</h4>
                      <p className="text-xs text-white/50 leading-relaxed">Bộ tài liệu thôi miên khách hàng giúp viết bài, làm kịch bản bán hàng trong 3 giây.</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => {
                          const content = `[KỊCH BẢN VIDEO TIKTOK 60S - 100+ PROMPT CHATGPT]\n- Cảnh 1: Mặt đối diện camera biểu cảm bức xúc.\n- Lời thoại (Hook): "Đừng bao giờ tự ngồi viết bài bán hàng nữa! Bạn đang lãng phí 3 tiếng cuộc đời mỗi ngày vô ích..."\n- Cảnh 2: Quay màn hình máy tính đang gõ ChatGPT chạy ra bài viết bán hàng cực đỉnh.\n- Lời thoại: "Đây là cách mình viết xong 5 bài quảng cáo Facebook chỉ trong đúng 30 giây bằng ChatGPT. Bí quyết không phải là AI thông minh, mà là do bộ PROMPT (câu lệnh) thôi miên này."\n- Cảnh 3: Chỉ tay xuống màn hình.\n- Lời thoại (CTA): "Mình đã tổng hợp hơn 100 Prompt viết bài chốt sale siêu đỉnh vào Ebook dưới link Bio của mình. Giá chỉ bằng một ly trà sữa 49k. Bấm vào mua và tải về dùng ngay để tiết kiệm 95% thời gian nhé!"`;
                          navigator.clipboard.writeText(content);
                          alert('Đã copy Kịch bản TikTok!');
                        }}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all"
                      >
                        🎬 Copy Kịch bản TikTok
                      </button>
                      <button 
                        onClick={() => {
                          const content = `[BÀI ĐĂNG FACEBOOK ADS/GROUP - 100+ PROMPT CHATGPT]\n🔥 CẢNH BÁO: CHATGPT SẼ LÀM BẠN MẤT KHÁCH NẾU KHÔNG BIẾT DÙNG CÂU LỆNH NÀY!\n\nRất nhiều bạn than phiền viết bài bán hàng bằng ChatGPT đọc nghe rất "robot", ngô nghê và không có cảm xúc chốt sale. Đó là vì bạn chỉ ra lệnh chung chung: "Hãy viết bài bán hàng cho tôi".\n\nĐể ChatGPT viết hay như một Copywriter 5 năm kinh nghiệm, bạn phải huấn luyện nó theo công thức:\n1. Xác định rõ chân dung khách hàng mục tiêu.\n2. Thiết lập giọng điệu (Tone of Voice) thân thiện, hài hước hoặc chuyên gia.\n3. Áp dụng công thức thôi miên AIDA/PAS.\n\n👉 Mình đã đóng gói toàn bộ 100+ Prompt (Câu lệnh) huấn luyện ChatGPT đỉnh cao này vào cuốn Cẩm Nang Thôi Miên Khách Hàng. \n📥 Tải về trực tiếp tại link Bio của mình chỉ với 49.000đ (Giá gốc 199k - Khuyến mãi hôm nay): [DÁN LINK BIO CỦA BẠN VÀO ĐÂY]`;
                          navigator.clipboard.writeText(content);
                          alert('Đã copy Bài đăng Facebook!');
                        }}
                        className="w-full py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 text-xs font-semibold rounded-xl transition-all"
                      >
                        ✍️ Copy Bài đăng Facebook
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Ebook TikTok */}
                  <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                        <Users className="w-5 h-5 text-green-400" />
                      </div>
                      <h4 className="font-bold text-sm text-white">Ebook: Bí Kíp Xây Kênh TikTok</h4>
                      <p className="text-xs text-white/50 leading-relaxed">Cẩm nang bẻ khóa thuật toán 2026, 15 mẫu Hook triệu view thu hút khách hàng tiềm năng.</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => {
                          const content = `[KỊCH BẢN VIDEO TIKTOK 60S - BÍ KÍP XÂY KÊNH TIKTOK]\n- Cảnh 1: Mặt biểu cảm nghiêm trọng, lắc đầu.\n- Lời thoại (Hook): "Đừng đăng video lên TikTok nữa nếu kênh của bạn vẫn lẹt đẹt dưới 1000 view! Bạn đã dính phải 3 lỗi cơ bản này..."\n- Cảnh 2: Quay cảnh bảng viết hoặc màn hình máy tính chỉ ra 3 lỗi: Không tối ưu 3 giây đầu, đổi chủ đề liên tục, hashtag sai cách.\n- Lời thoại: "Lỗi lớn nhất là bạn không giữ chân được người xem trong 3 giây đầu tiên. Thuật toán TikTok 2026 chấm điểm giữ chân cực kỳ nặng."\n- Cảnh 3: Cầm điện thoại chỉ vào trang Bio của mình.\n- Lời thoại (CTA): "Mình đã soạn sẵn Lộ trình 30 ngày xây kênh từ con số 0 kèm 15 mẫu Hook giật tít ăn tiền trong Ebook ở link Bio. Bấm tải ngay chỉ với 79k để cứu kênh của bạn nhé!"`;
                          navigator.clipboard.writeText(content);
                          alert('Đã copy Kịch bản TikTok!');
                        }}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all"
                      >
                        🎬 Copy Kịch bản TikTok
                      </button>
                      <button 
                        onClick={() => {
                          const content = `[BÀI ĐĂNG FACEBOOK ADS/GROUP - BÍ KÍP XÂY KÊNH TIKTOK]\n🔥 THUẬT TOÁN TIKTOK 2026 ĐÃ THAY ĐỔI - KÊNH CỦA BẠN ĐÃ CẬP NHẬT CHƯA?\n\nNếu bạn vẫn đang đăng video theo kiểu "hên xui", không có kịch bản giữ chân người xem thì xin chia buồn: video của bạn sẽ mãi mãi lẹt đẹt lèo tèo vài trăm view.\n\nĐể bẻ khóa thuật toán TikTok và kéo hàng triệu view organic traffic về bán hàng, bạn cần làm đúng:\n1. Công thức viết kịch bản 3 giây đầu giữ chân (Hook).\n2. Quy trình làm video chuẩn SEO TikTok Search.\n3. Kế hoạch đăng bài 30 ngày liên tục tạo tín hiệu tốt cho kênh.\n\n👉 Tất cả bí mật này được mình đúc kết trong cuốn Ebook "Bí Kíp Xây Kênh TikTok Triệu View". \n📥 Link tải tài liệu trực tiếp nằm ở Bio cá nhân của mình (Giá ưu đãi chỉ 79.000đ): [DÁN LINK BIO CỦA BẠN VÀO ĐÂY]`;
                          navigator.clipboard.writeText(content);
                          alert('Đã copy Bài đăng Facebook!');
                        }}
                        className="w-full py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 text-xs font-semibold rounded-xl transition-all"
                      >
                        ✍️ Copy Bài đăng Facebook
                      </button>
                    </div>
                  </div>

                  {/* Card 3: 500+ Mẫu Canva */}
                  <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <ShoppingBag className="w-5 h-5 text-purple-400" />
                      </div>
                      <h4 className="font-bold text-sm text-white">Ebook: 500+ Mẫu Canva</h4>
                      <p className="text-xs text-white/50 leading-relaxed">Kho tài nguyên thiết kế banner, slide thuyết trình, cv chuyên nghiệp kéo thả trong 1 click.</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => {
                          const content = `[KỊCH BẢN VIDEO TIKTOK 60S - 500+ MẪU CANVA]\n- Cảnh 1: Chỉ tay vào màn hình thiết kế Canva lung linh cực đẹp.\n- Lời thoại (Hook): "Dành ra 2 tiếng để thiết kế một cái Slide thuyết trình hay Banner? Quá xưa rồi! Đây là cách mình thiết kế xong trong đúng 1 phút..."\n- Cảnh 2: Quay cảnh kéo thả một mẫu template có sẵn vô cùng nhanh chóng và đổi màu, chữ.\n- Lời thoại: "Chỉ cần chọn 1 trong 500 mẫu Canva Pro đã được thiết kế sẵn bởi các Designer chuyên nghiệp, kéo thả ảnh của bạn vào là xong. Đẹp mê ly."\n- Cảnh 3: Mặt vui vẻ kêu gọi hành động.\n- Lời thoại (CTA): "Trọn bộ 500+ mẫu Canva đa dạng lĩnh vực Slide, CV, Banner mình để link tải ở Bio. Chỉ 99k cho cả kho tài nguyên dùng trọn đời. Bấm tải ngay nhé!"`;
                          navigator.clipboard.writeText(content);
                          alert('Đã copy Kịch bản TikTok!');
                        }}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all"
                      >
                        🎬 Copy Kịch bản TikTok
                      </button>
                      <button 
                        onClick={() => {
                          const content = `[BÀI ĐĂNG FACEBOOK ADS/GROUP - 500+ MẪU CANVA]\n🎨 KHÔNG CẦN BIẾT PHOTOSHOP VẪN THIẾT KẾ ĐẸP NHƯ DESIGNER CHUYÊN NGHIỆP!\n\nBạn đang chuẩn bị thuyết trình, làm CV xin việc hay thiết kế banner quảng cáo bán hàng nhưng không biết dùng các phần mềm đồ họa phức tạp? \n\nGiải pháp hoàn hảo nhất chính là tận dụng kho **500+ Mẫu Canva Cao Cấp** được thiết kế sẵn:\n- 150+ Mẫu slide thuyết trình ấn tượng, chuyên nghiệp.\n- 100+ Mẫu CV xin việc chinh phục nhà tuyển dụng.\n- 250+ Mẫu banner quảng cáo, avatar, cover thu hút lượt tương tác.\n- Chỉ việc kéo, thả ảnh và thay đổi nội dung trong 1 nốt nhạc!\n\n👉 Trở thành Designer chuyên nghiệp ngay hôm nay chỉ với 99.000đ.\n📥 Tải trọn bộ link Canva trực tiếp tại link Bio của mình: [DÁN LINK BIO CỦA BẠN VÀO ĐÂY]`;
                          navigator.clipboard.writeText(content);
                          alert('Đã copy Bài đăng Facebook!');
                        }}
                        className="w-full py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 text-xs font-semibold rounded-xl transition-all"
                      >
                        ✍️ Copy Bài đăng Facebook
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-brand-orange/5 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    💡 Hướng dẫn tăng traffic nhanh để kiếm đơn hàng:
                  </h4>
                  <ul className="text-xs text-white/60 space-y-2 list-disc pl-5 leading-relaxed">
                    <li>Sử dụng kịch bản video trên, dùng điện thoại quay phim hoặc ghép chữ chạy trên Canva để đăng đều đặn mỗi ngày 1-2 video lên TikTok.</li>
                    <li>Đăng bài viết chia sẻ giá trị lên các Group Facebook có tệp khách hàng tiềm năng lớn (Ví dụ: Group học sinh sinh viên, Group cộng đồng làm Canva, Group chia sẻ tài liệu ChatGPT).</li>
                    <li>Luôn kêu gọi hành động (Call To Action) rõ ràng: Khách hàng click vào link Bio của bạn để mua sản phẩm và nhận file tự động qua Email!</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card rounded-2xl border border-white/10 overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                {editingProduct ? 'Chỉnh sửa sản phẩm số' : 'Thêm sản phẩm số mới'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-white/50 font-semibold mb-2">Tên sản phẩm số</label>
                <input 
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ví dụ: Ebook hướng dẫn kiếm tiền MMO..."
                  className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 font-semibold mb-2">Mô tả chi tiết sản phẩm</label>
                <textarea 
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Mô tả các lợi ích, tài nguyên khách hàng nhận được khi mua file này..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 font-semibold mb-2">Giá bán (VND)</label>
                  <input 
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                    min={0}
                    step={1000}
                    className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-white/50 font-semibold mb-2">Đường dẫn ảnh bìa (Cover Image URL)</label>
                  <input 
                    type="text"
                    value={prodCover}
                    onChange={(e) => setProdCover(e.target.value)}
                    placeholder="Link ảnh minh họa"
                    className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 font-semibold mb-2">Đường dẫn file sản phẩm (Link tải zip, pdf, drive...)</label>
                <input 
                  type="text"
                  value={prodFile}
                  onChange={(e) => setProdFile(e.target.value)}
                  placeholder="Ví dụ: https://github.com/.../archive/main.zip"
                  className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                  required
                />
                <span className="text-[10px] text-white/30 mt-1 block">Sau khi chuyển khoản thành công, hệ thống tự hiển thị link này để khách tải file.</span>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl shadow-lg transition-all duration-300 text-xs"
              >
                {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
              </button>
            </form>

          </div>
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
    </div>
  );
};
export default Dashboard;
