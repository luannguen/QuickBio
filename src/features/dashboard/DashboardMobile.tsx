import React, { useState } from 'react';
import type { Product } from '../../services/productService';
import type { Order } from '../../services/orderService';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { ProductsTab } from './components/ProductsTab';
import { OrdersTab } from './components/OrdersTab';
import { SepayTab } from './components/SepayTab';
import { AffiliateTab } from './components/AffiliateTab';
import { AiContentTab } from './components/AiContentTab';
import { MarketingTab } from './components/MarketingTab';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Menu, 
  X, 
  Settings, 
  Sparkles, 
  BookOpen, 
  Eye, 
  ChevronRight
} from 'lucide-react';

interface DashboardMobileProps {
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

export const DashboardMobile: React.FC<DashboardMobileProps> = (props) => {
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

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img 
          src={user.avatar_url} 
          alt={user.full_name} 
          className="w-8 h-8 rounded-full object-cover border border-white/10"
        />
        <div>
          <h2 className="text-xs font-bold text-white leading-tight">{user.full_name}</h2>
          <span className="text-[9px] text-[#FF6B35] font-semibold uppercase">
            {userPlan === 'pro' ? 'QuickBio Pro' : 'Free Account'}
          </span>
        </div>
      </div>

      <button 
        onClick={signOut}
        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold rounded-lg transition-all"
      >
        Đăng xuất
      </button>
    </div>
  );

  const bottomNavContent = (
    <>
      <button
        onClick={() => {
          setActiveTab('products');
          setIsMoreMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          activeTab === 'products' && !isMoreMenuOpen ? 'text-[#FF6B35]' : 'text-white/40'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[9px] font-semibold mt-1">Sản phẩm</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('orders');
          setIsMoreMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          activeTab === 'orders' && !isMoreMenuOpen ? 'text-[#FF6B35]' : 'text-white/40'
        }`}
      >
        <DollarSign className="w-5 h-5" />
        <span className="text-[9px] font-semibold mt-1">Đơn hàng</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('affiliate');
          setIsMoreMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          activeTab === 'affiliate' && !isMoreMenuOpen ? 'text-[#FF6B35]' : 'text-white/40'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[9px] font-semibold mt-1">Affiliate</span>
      </button>

      <button
        onClick={() => setIsMoreMenuOpen(true)}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          isMoreMenuOpen || ['sepay', 'ai-content', 'marketing'].includes(activeTab) ? 'text-[#FF6B35]' : 'text-white/40'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-[9px] font-semibold mt-1">Thêm</span>
      </button>
    </>
  );

  const handleSelectMoreTab = (tab: any) => {
    setActiveTab(tab);
    setIsMoreMenuOpen(false);
  };

  return (
    <MobileLayout headerContent={headerContent} bottomNavContent={bottomNavContent}>
      
      {/* Promotion Panel for Free Users */}
      {userPlan === 'free' && (
        <div className="bg-brand-orange/10 p-4 rounded-xl border border-brand-orange/20 text-xs space-y-3">
          <p className="leading-relaxed">
            🚀 <strong>Nâng cấp QuickBio PRO:</strong> Mở khóa tính năng đăng bán sản phẩm không giới hạn, viết content tự động bằng AI, bật CTV Affiliate.
          </p>
          <button 
            onClick={onProUpgradeClick}
            className="w-full py-2 bg-brand-orange hover:bg-brand-coral text-white font-bold rounded-lg text-[10px] transition-colors touch-target min-h-[44px]"
          >
            Nâng cấp PRO chỉ 99k/tháng
          </button>
        </div>
      )}

      {/* Revenue brief for Mobile */}
      <div className="glass-card p-4 rounded-xl border border-white/5 flex justify-between items-center">
        <div>
          <span className="text-[9px] text-white/40 uppercase font-black tracking-wider">Doanh thu khả dụng</span>
          <div className="text-xl font-black text-white mt-0.5">
            {totalRevenue.toLocaleString('vi-VN')}đ
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-white/40 uppercase font-black tracking-wider">Sản phẩm đang bán</span>
          <div className="text-xl font-black text-sky-400 mt-0.5">
            {products.length} mục
          </div>
        </div>
      </div>

      {/* Render active content */}
      <div className="glass-panel p-4 rounded-xl border border-white/5">
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

      {/* Mobile "More" Drawer Menu Sheet Overlay */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-[80vw] max-w-sm h-full bg-[#0d111a] border-l border-white/5 p-6 flex flex-col justify-between shadow-2xl relative">
            <button 
              onClick={() => setIsMoreMenuOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2 min-h-[44px] min-w-[44px]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 pt-10">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-white">Tính năng mở rộng</h3>
                <p className="text-[10px] text-white/40">Chọn cấu hình hoặc thiết lập công cụ bổ sung.</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Cấu hình VietQR & Ngân hàng', id: 'sepay', icon: <Settings className="w-4 h-4 text-brand-orange" /> },
                  { name: 'Sáng tạo AI (Gemini)', id: 'ai-content', icon: <Sparkles className="w-4 h-4 text-brand-orange" /> },
                  { name: 'Thư viện Tiếp thị (Marketing)', id: 'marketing', icon: <BookOpen className="w-4 h-4 text-brand-orange" /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMoreTab(item.id as any)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold flex items-center gap-3 transition-colors ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-brand-orange/15 to-brand-coral/5 border-brand-orange/30 text-brand-orange' 
                        : 'bg-transparent border-white/5 text-white/70 hover:bg-white/5'
                    } min-h-[44px]`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Drawer Footer */}
            <div className="space-y-3.5 pt-6 border-t border-white/5">
              <button 
                onClick={() => {
                  onNavigateToBioBuilder();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 touch-target min-h-[44px]"
              >
                <span>Thiết kế Bio Link</span>
              </button>
              
              <button 
                onClick={() => {
                  onNavigateToBioPublic(userSlug || 'luannguyen');
                  setIsMoreMenuOpen(false);
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 touch-target min-h-[44px]"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Bio công khai</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </MobileLayout>
  );
};
