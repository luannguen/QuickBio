import React, { useState } from 'react';
import type { Product } from "@/entities/product/api";
import type { Order } from "@/entities/order/api";
import { Layout } from "@/app/layouts/Layout";
import { ProductsTab } from './components/ProductsTab';
import { OrdersTab } from './components/OrdersTab';
import { SepayTab } from './components/SepayTab';
import { AffiliateTab } from './components/AffiliateTab';
import { AiContentTab } from './components/AiContentTab';
import { MarketingTab } from './components/MarketingTab';
import { ArticlesTab } from './components/ArticlesTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { LandingPagesTab } from './components/LandingPagesTab';
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { 
  Sparkles, Eye, DollarSign, ShoppingBag, BookOpen, 
  Users, Menu, X, Settings, ChevronRight, Home, ShieldCheck, Activity
} from 'lucide-react';

interface DashboardViewProps {
  activeTab: 'products' | 'orders' | 'sepay' | 'affiliate' | 'ai-content' | 'marketing' | 'articles' | 'analytics' | 'landing';
  setActiveTab: React.Dispatch<React.SetStateAction<"products" | "orders" | "sepay" | "affiliate" | "ai-content" | "marketing" | "articles" | "analytics" | "landing">>;
  user: any;
  userPlan: 'free' | 'pro' | 'premium';
  planPurchasedAt?: string;
  planExpiresAt?: string;
  products: Product[];
  orders: Order[];
  pendingOrders: Order[];
  userSlug: string;
  signOut: () => void;
  onNavigateToBioBuilder: () => void;
  onNavigateToBioPublic: (slug: string) => void;
  onNavigateToHome?: () => void;
  onNavigateToAdmin?: () => void;
  onProUpgradeClick: () => void;
  
  // Product handlers
  onAddProductClick: () => void;
  onEditProductClick: (p: Product) => void;
  onDeleteProduct: (id: string) => void;

  // Article handlers
  articles: any[];
  onAddArticleClick: () => void;
  onEditArticleClick: (a: any) => void;
  onDeleteArticle: (id: string) => void;

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
  telegramChatId: string;
  onTelegramChatIdChange: (val: string) => void;
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

export const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const {
    activeTab,
    setActiveTab,
    user,
    userPlan,
    planPurchasedAt,
    planExpiresAt,
    products,
    orders,
    userSlug,
    signOut,
    onNavigateToBioBuilder,
    onNavigateToBioPublic,
    onProUpgradeClick,
    onNavigateToHome,
    onNavigateToAdmin
  } = props;

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalOrders = orders.filter(o => o.status === 'paid').length;

  const sidebarContent = (
    <div className="space-y-2">
      {[
        { name: 'Thống kê (Analytics)', id: 'analytics' },
        { name: 'Landing Pages', id: 'landing' },
        { name: 'Quản lý Sản phẩm', id: 'products', count: products.length },
        { name: 'Đơn hàng mua bán', id: 'orders', count: orders.length },
        { name: 'Bài viết (Blog)', id: 'articles', count: props.articles?.length || 0 },
        { name: 'Cấu hình VietQR & Ngân hàng', id: 'sepay' },
        { name: 'Kiếm tiền (Affiliate)', id: 'affiliate' },
        { name: 'Sáng tạo AI (Gemini)', id: 'ai-content' },
        { name: 'Thư viện Tiếp thị (Marketing)', id: 'marketing' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium flex items-center justify-between border transition-all ${
            activeTab === tab.id 
              ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' 
              : 'bg-transparent border-transparent text-semantic-muted hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <span>{tab.name}</span>
          {tab.count !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-brand-orange/20 text-brand-orange' : 'bg-muted/50 text-semantic-muted'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysRemaining = getDaysRemaining(user?.plan_expires_at);

  const headerContent = (
    <div className="flex justify-between items-center w-full relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center cursor-pointer" onClick={onNavigateToHome}>
          <Sparkles className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight hidden lg:block">QuickBio Console</h1>
          <h1 className="text-sm font-bold tracking-tight lg:hidden">{user.full_name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-semantic-muted hidden lg:block">Quản lý cửa hàng sản phẩm số & Bio-Link của bạn</p>
            {userPlan !== 'free' && daysRemaining !== null && (
              <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full border border-brand-orange/20 hidden lg:inline-block">
                Còn {daysRemaining} ngày
              </span>
            )}
          </div>
          <span className="text-[10px] text-brand-orange font-semibold uppercase lg:hidden flex items-center gap-1">
            {userPlan === 'premium' ? 'Premium' : userPlan === 'pro' ? 'Pro' : 'Free Account'}
            {userPlan !== 'free' && daysRemaining !== null && ` (${daysRemaining} ngày)`}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3">
        {onNavigateToHome && (
          <Button onClick={onNavigateToHome} variant="ghost" className="text-semantic-muted hover:text-foreground">
            <Home className="w-4 h-4 mr-2" />
            Trang Chủ
          </Button>
        )}
        <Button onClick={onNavigateToBioBuilder}>Thiết kế Bio Link</Button>
        <Button onClick={() => onNavigateToBioPublic(userSlug || 'luannguyen')} variant="secondary">
          <Eye className="w-4 h-4 mr-2" />
          Xem trang Bio
        </Button>
        {isAdmin && onNavigateToAdmin && (
          <Button onClick={onNavigateToAdmin} variant="outline" className="border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10">
            <ShieldCheck className="w-4 h-4 mr-2" /> Admin Console
          </Button>
        )}
        <Button onClick={signOut} variant="ghost" className="text-semantic-muted">
          Đăng xuất
        </Button>
        <ThemeToggle />
      </div>

      <div className="flex lg:hidden items-center gap-2">
        <ThemeToggle />
        <button 
          onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
          className="p-2 -mr-2 text-foreground focus:outline-none"
        >
          {isHeaderMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isHeaderMenuOpen && (
        <div className="absolute top-[60px] right-0 w-64 bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-2xl z-50 lg:hidden animate-in fade-in slide-in-from-top-4">
          {onNavigateToHome && (
            <Button onClick={() => { onNavigateToHome(); setIsHeaderMenuOpen(false); }} variant="ghost" className="w-full justify-start text-sm">
              <Home className="w-4 h-4 mr-3" /> Trang Chủ
            </Button>
          )}
          <Button onClick={() => { onNavigateToBioBuilder(); setIsHeaderMenuOpen(false); }} variant="ghost" className="w-full justify-start text-sm">
            <Settings className="w-4 h-4 mr-3" /> Thiết kế Bio Link
          </Button>
          <Button onClick={() => { onNavigateToBioPublic(userSlug || 'luannguyen'); setIsHeaderMenuOpen(false); }} variant="ghost" className="w-full justify-start text-sm">
            <Eye className="w-4 h-4 mr-3" /> Xem trang Bio
          </Button>
          {isAdmin && onNavigateToAdmin && (
            <Button onClick={() => { onNavigateToAdmin(); setIsHeaderMenuOpen(false); }} variant="outline" className="w-full justify-start text-sm border-brand-orange/50 text-brand-orange">
              <ShieldCheck className="w-4 h-4 mr-3" /> Admin Console
            </Button>
          )}
          <div className="h-px w-full bg-border my-1" />
          <Button onClick={() => { signOut(); setIsHeaderMenuOpen(false); }} variant="secondary" className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10">
            Đăng xuất
          </Button>
        </div>
      )}
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
          activeTab === 'products' && !isMoreMenuOpen ? 'text-brand-orange' : 'text-semantic-muted'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Sản phẩm</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('orders');
          setIsMoreMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          activeTab === 'orders' && !isMoreMenuOpen ? 'text-brand-orange' : 'text-semantic-muted'
        }`}
      >
        <DollarSign className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Đơn hàng</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('affiliate');
          setIsMoreMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          activeTab === 'affiliate' && !isMoreMenuOpen ? 'text-brand-orange' : 'text-semantic-muted'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Affiliate</span>
      </button>

      <button
        onClick={() => setIsMoreMenuOpen(true)}
        className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${
          isMoreMenuOpen || ['sepay', 'ai-content', 'marketing', 'articles', 'analytics'].includes(activeTab) ? 'text-brand-orange' : 'text-semantic-muted'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Thêm</span>
      </button>
    </>
  );

  const handleSelectMoreTab = (tab: any) => {
    setActiveTab(tab);
    setIsMoreMenuOpen(false);
  };

  return (
    <Layout 
      headerContent={headerContent} 
      sidebarContent={sidebarContent}
      bottomNavContent={bottomNavContent}
    >
      {/* Mobile Promotion Panel */}
      {userPlan === 'free' && (
        <div className="lg:hidden bg-brand-orange/10 p-4 rounded-xl border border-brand-orange/20 text-xs space-y-3">
          <p className="leading-relaxed text-brand-orange">
            🚀 <strong>Nâng cấp QuickBio PRO:</strong> Mở khóa tính năng đăng bán sản phẩm không giới hạn, viết content tự động bằng AI, bật CTV Affiliate.
          </p>
          <Button 
            onClick={onProUpgradeClick}
            className="w-full"
          >
            Nâng cấp PRO chỉ 99k/tháng
          </Button>
        </div>
      )}

      {/* Desktop User Profile Card */}
      <Card className="hidden lg:flex p-6 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={user.avatar_url} 
            alt={user.full_name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-border"
          />
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              Chào, {user.full_name}!
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                userPlan === 'pro'
                  ? 'bg-semantic-success/10 border-semantic-success/30 text-semantic-success font-bold'
                  : 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange'
              }`}>
                {userPlan === 'pro' ? 'QuickBio Pro' : 'QuickBio Free'}
              </span>
            </h2>
            <p className="text-sm text-semantic-muted mt-1">{user.email}</p>
          </div>
        </div>
        
        {userPlan === 'free' ? (
          <div className="bg-brand-orange/10 px-5 py-4 rounded-xl border border-brand-orange/20 text-sm text-brand-orange max-w-lg flex items-center justify-between gap-4">
            <div>
              🚀 <strong>Gói Free giới hạn (1 Sản phẩm, Không AI):</strong> Nâng cấp gói Pro để mở rộng sản phẩm không giới hạn, kích hoạt AI viết content tự động.
            </div>
            <Button 
              onClick={onProUpgradeClick}
              className="flex-shrink-0"
            >
              Nâng cấp Pro
            </Button>
          </div>
        ) : (
          <div className="bg-semantic-success/10 px-5 py-4 rounded-xl border border-semantic-success/20 text-sm text-semantic-success max-w-md">
            🎉 <strong>Tài khoản Pro:</strong> Bạn đang sở hữu toàn bộ các quyền năng nâng cao nhất (AI Content, Affiliate, Không giới hạn sản phẩm).
          </div>
        )}
      </Card>

      {/* Plan Tracking Card */}
      {userPlan !== 'free' && (
        <Card className="p-4 lg:p-6 space-y-3 relative overflow-hidden border-brand-orange/30 bg-gradient-to-r from-brand-orange/5 to-transparent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-brand-orange flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Đang sử dụng Gói {userPlan === 'premium' ? 'PREMIUM' : 'PRO'}
              </h3>
              <p className="text-xs text-semantic-muted mt-1">
                {planPurchasedAt && `Ngày đăng ký: ${new Date(planPurchasedAt).toLocaleDateString('vi-VN')} `}
                {planPurchasedAt && planExpiresAt && '| '}
                {planExpiresAt && `Hết hạn: ${new Date(planExpiresAt).toLocaleDateString('vi-VN')}`}
              </p>
            </div>
            {planExpiresAt && (
              <div className="bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-semantic-muted font-bold uppercase tracking-wider">Thời gian còn lại</div>
                  <div className="text-xl font-extrabold text-foreground leading-tight">
                    {getDaysRemaining(planExpiresAt)} <span className="text-xs font-medium text-semantic-muted">ngày</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 space-y-3 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-24 h-24 bg-brand-orange/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] lg:text-xs text-semantic-muted font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
            <DollarSign className="w-5 h-5 text-brand-orange hidden lg:block" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-foreground">
            {totalRevenue.toLocaleString('vi-VN')} <span className="text-sm lg:text-lg font-medium text-brand-orange">VND</span>
          </div>
          <p className="text-[10px] text-semantic-muted hidden lg:block">Dòng tiền chảy thẳng về tài khoản ngân hàng của bạn.</p>
        </Card>

        <Card className="p-4 lg:p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] lg:text-xs text-semantic-muted font-bold uppercase tracking-wider">Đơn thành công</span>
            <ShoppingBag className="w-5 h-5 text-semantic-success hidden lg:block" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-foreground">
            {totalOrders} <span className="text-sm lg:text-lg font-medium text-semantic-muted">đơn</span>
          </div>
          <p className="text-[10px] text-semantic-muted hidden lg:block">Mở khóa link tải file và tự động gửi mail thành công.</p>
        </Card>

        <Card className="p-4 lg:p-6 space-y-3 hidden lg:block">
          <div className="flex justify-between items-center">
            <span className="text-xs text-semantic-muted font-bold uppercase tracking-wider">Sản phẩm đang bán</span>
            <BookOpen className="w-5 h-5 text-semantic-info" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {products.length} <span className="text-lg font-medium text-semantic-muted">mục</span>
          </div>
          <p className="text-[10px] text-semantic-muted">Quản lý và cập nhật dễ dàng mọi lúc.</p>
        </Card>
      </div>

      {/* Render active content */}
      <Card className="p-4 lg:p-6">
        {activeTab === 'landing' && (
          <LandingPagesTab
            userId={user?.id}
            userPlan={userPlan}
            userSlug={userSlug}
            onProUpgradeClick={onProUpgradeClick}
          />
        )}

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
            telegramChatId={props.telegramChatId}
            onTelegramChatIdChange={props.onTelegramChatIdChange}
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

        {activeTab === 'articles' && (
          <ArticlesTab
            articles={props.articles || []}
            onAddArticleClick={props.onAddArticleClick}
            onEditArticleClick={props.onEditArticleClick}
            onDeleteArticle={props.onDeleteArticle}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab userId={user?.id} />
        )}
      </Card>

      {/* Mobile "More" Drawer Menu Sheet Overlay */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in lg:hidden">
          <div className="w-[80vw] max-w-sm h-full bg-brand-card border-l border-border p-6 flex flex-col justify-between shadow-2xl relative">
            <button 
              onClick={() => setIsMoreMenuOpen(false)}
              className="absolute top-4 right-4 text-semantic-muted hover:text-foreground p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 pt-10">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-foreground">Tính năng mở rộng</h3>
                <p className="text-[10px] text-semantic-muted">Chọn cấu hình hoặc thiết lập công cụ bổ sung.</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Thống kê (Analytics)', id: 'analytics', icon: <Activity className="w-4 h-4 text-brand-orange" /> },
                  { name: 'Bài viết (Blog)', id: 'articles', icon: <BookOpen className="w-4 h-4 text-brand-orange" /> },
                  { name: 'Cấu hình VietQR', id: 'sepay', icon: <Settings className="w-4 h-4 text-brand-orange" /> },
                  { name: 'Sáng tạo AI (Gemini)', id: 'ai-content', icon: <Sparkles className="w-4 h-4 text-brand-orange" /> },
                  { name: 'Marketing Hub', id: 'marketing', icon: <BookOpen className="w-4 h-4 text-brand-orange" /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMoreTab(item.id as any)}
                    className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium flex items-center gap-3 transition-colors ${
                      activeTab === item.id 
                        ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' 
                        : 'bg-transparent border-border text-semantic-muted hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-30" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <Button 
                onClick={() => {
                  onNavigateToBioBuilder();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full h-12"
              >
                Thiết kế Bio Link
              </Button>
              
              <Button 
                onClick={() => {
                  onNavigateToBioPublic(userSlug || 'luannguyen');
                  setIsMoreMenuOpen(false);
                }}
                variant="secondary"
                className="w-full h-12"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem Bio công khai
              </Button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};
