import type { Product } from '../../services/productService';
import type { Order } from '../../services/orderService';
import { DesktopLayout } from '../../components/layout/DesktopLayout';
import { ProductsTab } from './components/ProductsTab';
import { OrdersTab } from './components/OrdersTab';
import { SepayTab } from './components/SepayTab';
import { AffiliateTab } from './components/AffiliateTab';
import { AiContentTab } from './components/AiContentTab';
import { MarketingTab } from './components/MarketingTab';
import { Sparkles, Eye, DollarSign, ShoppingBag, BookOpen } from 'lucide-react';

interface DashboardDesktopProps {
  activeTab: 'products' | 'orders' | 'sepay' | 'affiliate' | 'ai-content' | 'marketing';
  setActiveTab: (tab: 'products' | 'orders' | 'sepay' | 'affiliate' | 'ai-content' | 'marketing') => void;
  user: any;
  userPlan: 'free' | 'pro';
  products: Product[];
  orders: Order[];
  pendingOrders: Order[];
  userSlug: string;
  signOut: () => void;
  onNavigateToBioBuilder: () => void;
  onNavigateToBioPublic: (slug: string) => void;
  onProUpgradeClick: () => void;
  
  // Product handlers
  onAddProductClick: () => void;
  onEditProductClick: (p: Product) => void;
  onDeleteProduct: (id: string) => void;

  // Order simulator
  simulatingOrderId: string;
  onSimulatingOrderIdChange: (id: string) => void;
  onSimulateWebhook: () => void;
  isSimulating: boolean;
  simulatorStatus: string;

  // Sepay config
  bankCode: string;
  onBankCodeChange: (val: string) => void;
  bankAccount: string;
  onBankAccountChange: (val: string) => void;
  accountName: string;
  onAccountNameChange: (val: string) => void;
  apiKey: string;
  onApiKeyChange: (val: string) => void;
  configSuccess: boolean;
  onSaveBankConfig: (e: React.FormEvent) => void;

  // Affiliate config
  clicksCount: number;
  commissions: any[];
  withdrawLoading: boolean;
  withdrawSuccess: boolean;
  onRequestWithdrawal: () => void;
  affiliateCode: string;
  onAffiliateCodeChange: (val: string) => void;
  paymentInfo: string;
  onPaymentInfoChange: (val: string) => void;
  affiliateSuccess: boolean;
  onSaveAffiliate: (e: React.FormEvent) => void;
  linkCopied: boolean;
  onLinkCopiedChange: (val: boolean) => void;

  // AI Content config
  aiTopic: string;
  onAiTopicChange: (val: string) => void;
  aiChannel: string;
  onAiChannelChange: (val: string) => void;
  aiTone: string;
  onAiToneChange: (val: string) => void;
  aiApiKey: string;
  onAiApiKeyChange: (val: string) => void;
  aiGenerating: boolean;
  aiError: string;
  aiResult: string;
  onGenerateAIContent: (e: React.FormEvent) => void;

  // Marketing config
  mktFbPageId: string;
  onMktFbPageIdChange: (val: string) => void;
  mktTargetProductId: string;
  onMktTargetProductIdChange: (val: string) => void;
  mktFbPageToken: string;
  onMktFbPageTokenChange: (val: string) => void;
  mktStyle: string;
  onMktStyleChange: (val: string) => void;
  mktGeminiApiKey: string;
  onMktGeminiApiKeyChange: (val: string) => void;
  mktSaving: boolean;
  onSaveMarketingSettings: (e: React.FormEvent) => void;
  mktLastPostedAt: string;
  mktIsActive: boolean;
  onMktIsActiveChange: (val: boolean) => void;
  onTestAutoPost: () => void;
  mktTesting: boolean;
  mktTestSuccess: string;
  mktTestError: string;
  mktSubTab: 'autopost' | 'swipe';
  onMktSubTabChange: (val: 'autopost' | 'swipe') => void;
}

export const DashboardDesktop: React.FC<DashboardDesktopProps> = (props) => {
  const {
    activeTab,
    setActiveTab,
    user,
    userPlan,
    products,
    orders,
    userSlug,
    signOut,
    onNavigateToBioBuilder,
    onNavigateToBioPublic,
    onProUpgradeClick
  } = props;

  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalOrders = orders.filter(o => o.status === 'paid').length;

  const sidebarContent = (
    <div className="space-y-2">
      {[
        { name: 'Quản lý Sản phẩm', id: 'products', count: products.length },
        { name: 'Đơn hàng mua bán', id: 'orders', count: orders.length },
        { name: 'Cấu hình VietQR & Ngân hàng', id: 'sepay' },
        { name: 'Kiếm tiền (Affiliate)', id: 'affiliate' },
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
    </div>
  );

  const headerContent = (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">QuickBio Console</h1>
          <p className="text-xs text-white/50">Quản lý cửa hàng sản phẩm số & Bio-Link của bạn</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
  );

  return (
    <DesktopLayout sidebarContent={sidebarContent} headerContent={headerContent}>
      {/* User profile card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
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
          <div className="bg-brand-orange/10 px-5 py-4 rounded-xl border border-brand-orange/20 text-xs text-white/90 max-w-lg leading-relaxed flex items-center justify-between gap-4">
            <div>
              🚀 <strong>Gói Free giới hạn (1 Sản phẩm, Không AI):</strong> Nâng cấp gói Pro để mở rộng sản phẩm không giới hạn, kích hoạt AI viết content tự động.
            </div>
            <button 
              onClick={onProUpgradeClick}
              className="px-4 py-2 bg-brand-orange hover:bg-brand-coral text-white font-bold rounded-lg transition-colors flex-shrink-0 touch-target"
            >
              Nâng cấp Pro 99k
            </button>
          </div>
        ) : (
          <div className="bg-green-500/5 px-5 py-4 rounded-xl border border-green-500/10 text-xs text-white/70 max-w-md leading-relaxed">
            🎉 <strong>Tài khoản Pro:</strong> Bạn đang sở hữu toàn bộ các quyền năng nâng cao nhất (AI Content, Affiliate, Không giới hạn sản phẩm).
          </div>
        )}
      </div>

      {/* Stats cards grid */}
      <div className="grid grid-cols-3 gap-6">
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
            <ShoppingBag className="w-5 h-5 text-[#8BC34A]" />
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

      {/* Render tab content */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAddProductClick={props.onAddProductClick}
            onEditProductClick={props.onEditProductClick}
            onDeleteProduct={props.onDeleteProduct}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            pendingOrders={props.pendingOrders}
            simulatingOrderId={props.simulatingOrderId}
            onSimulatingOrderIdChange={props.onSimulatingOrderIdChange}
            onSimulateWebhook={props.onSimulateWebhook}
            isSimulating={props.isSimulating}
            simulatorStatus={props.simulatorStatus}
          />
        )}

        {activeTab === 'sepay' && (
          <SepayTab
            bankCode={props.bankCode}
            onBankCodeChange={props.onBankCodeChange}
            bankAccount={props.bankAccount}
            onBankAccountChange={props.onBankAccountChange}
            accountName={props.accountName}
            onAccountNameChange={props.onAccountNameChange}
            apiKey={props.apiKey}
            onApiKeyChange={props.onApiKeyChange}
            configSuccess={props.configSuccess}
            onSaveBankConfig={props.onSaveBankConfig}
          />
        )}

        {activeTab === 'affiliate' && (
          <AffiliateTab
            clicksCount={props.clicksCount}
            commissions={props.commissions}
            withdrawLoading={props.withdrawLoading}
            withdrawSuccess={props.withdrawSuccess}
            onRequestWithdrawal={props.onRequestWithdrawal}
            affiliateCode={props.affiliateCode}
            onAffiliateCodeChange={props.onAffiliateCodeChange}
            paymentInfo={props.paymentInfo}
            onPaymentInfoChange={props.onPaymentInfoChange}
            affiliateSuccess={props.affiliateSuccess}
            onSaveAffiliate={props.onSaveAffiliate}
            linkCopied={props.linkCopied}
            onLinkCopiedChange={props.onLinkCopiedChange}
            userSlug={userSlug}
          />
        )}

        {activeTab === 'ai-content' && (
          <AiContentTab
            userPlan={userPlan}
            aiTopic={props.aiTopic}
            onAiTopicChange={props.onAiTopicChange}
            aiChannel={props.aiChannel}
            onAiChannelChange={props.onAiChannelChange}
            aiTone={props.aiTone}
            onAiToneChange={props.onAiToneChange}
            aiApiKey={props.aiApiKey}
            onAiApiKeyChange={props.onAiApiKeyChange}
            aiGenerating={props.aiGenerating}
            aiError={props.aiError}
            aiResult={props.aiResult}
            onGenerateAIContent={props.onGenerateAIContent}
            onProUpgradeClick={onProUpgradeClick}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingTab
            mktFbPageId={props.mktFbPageId}
            onMktFbPageIdChange={props.onMktFbPageIdChange}
            mktTargetProductId={props.mktTargetProductId}
            onMktTargetProductIdChange={props.onMktTargetProductIdChange}
            mktFbPageToken={props.mktFbPageToken}
            onMktFbPageTokenChange={props.onMktFbPageTokenChange}
            mktStyle={props.mktStyle}
            onMktStyleChange={props.onMktStyleChange}
            mktGeminiApiKey={props.mktGeminiApiKey}
            onMktGeminiApiKeyChange={props.onMktGeminiApiKeyChange}
            mktSaving={props.mktSaving}
            onSaveMarketingSettings={props.onSaveMarketingSettings}
            mktLastPostedAt={props.mktLastPostedAt}
            mktIsActive={props.mktIsActive}
            onMktIsActiveChange={props.onMktIsActiveChange}
            onTestAutoPost={props.onTestAutoPost}
            mktTesting={props.mktTesting}
            mktTestSuccess={props.mktTestSuccess}
            mktTestError={props.mktTestError}
            mktSubTab={props.mktSubTab}
            onMktSubTabChange={props.onMktSubTabChange}
            products={products}
          />
        )}
      </div>
    </DesktopLayout>
  );
};
