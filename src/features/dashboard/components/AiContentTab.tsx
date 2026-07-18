import React from 'react';
import { Sparkles, AlertTriangle, Loader2, Copy } from 'lucide-react';
import { useToastStore } from "@/shared/stores/useToastStore";

interface AiContentTabProps {
  userPlan: 'free' | 'pro' | 'premium';
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
  onProUpgradeClick: () => void;
}

export const AiContentTab: React.FC<AiContentTabProps> = ({
  userPlan,
  aiTopic,
  onAiTopicChange,
  aiChannel,
  onAiChannelChange,
  aiTone,
  onAiToneChange,
  aiApiKey,
  onAiApiKeyChange,
  aiGenerating,
  aiError,
  aiResult,
  onGenerateAIContent,
  onProUpgradeClick
}) => {
  const toast = useToastStore();
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <h3 className="text-base font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-orange" />
        Sáng tạo Content Tự động bằng Gemini AI (Pro)
      </h3>

      {userPlan !== 'pro' ? (
        <div className="glass-card p-8 rounded-2xl border border-border text-center space-y-5 max-w-xl mx-auto py-12">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mx-auto border border-brand-orange/20">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-foreground">⭐ Tính năng độc quyền của QuickBio PRO</h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
              Gói PRO cho phép bạn sử dụng AI viết kịch bản TikTok 60s, viết bài bán hàng Facebook chốt sale cực đỉnh chỉ trong 1 giây mà không cần tự suy nghĩ.
            </p>
          </div>
          <button 
            type="button"
            onClick={onProUpgradeClick}
            className="px-6 py-3 bg-brand-orange hover:bg-brand-coral text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 touch-target min-h-[44px]"
          >
            Nâng cấp gói PRO chỉ 99k/tháng
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={onGenerateAIContent} className="glass-card p-6 rounded-2xl border border-border space-y-6">
            {aiError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {aiError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2">Chủ đề / Tên sản phẩm cần viết</label>
                <input 
                  type="text" 
                  value={aiTopic}
                  onChange={(e) => onAiTopicChange(e.target.value)}
                  placeholder="Ví dụ: Ebook dạy bán hàng Shopee, prompt chatgpt..."
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2 flex items-center justify-between">
                  <span>Google Gemini API Key</span>
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-orange underline">Lấy API Key Miễn Phí Tại Đây ↗</a>
                </label>
                <input 
                  type="password" 
                  value={aiApiKey}
                  onChange={(e) => onAiApiKeyChange(e.target.value)}
                  placeholder="Nhập API Key Gemini để sinh kịch bản"
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2">Định dạng nội dung</label>
                <select 
                  value={aiChannel}
                  onChange={(e) => onAiChannelChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-background border border-border outline-none focus:border-brand-orange/40"
                >
                  <option value="tiktok">Kịch bản Video ngắn (TikTok/Reels/Shorts 60s)</option>
                  <option value="facebook">Bài viết quảng cáo Facebook chốt sale (AIDA/PAS)</option>
                  <option value="product">Lập đề cương chi tiết sản phẩm số để tự bán</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2">Giọng điệu (Tone)</label>
                <select 
                  value={aiTone}
                  onChange={(e) => onAiToneChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-background border border-border outline-none focus:border-brand-orange/40"
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
              className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 touch-target min-h-[40px]"
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
            <div className="glass-card p-6 rounded-2xl border border-border space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Kết quả từ AI:</h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiResult);
                    toast.success('Đã copy nội dung vào bộ nhớ tạm!');
                  }}
                  className="px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 touch-target min-h-[32px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy nội dung
                </button>
              </div>
              <div className="bg-muted/30 p-5 rounded-xl border border-border text-xs text-foreground/80 leading-relaxed font-mono whitespace-pre-wrap select-all">
                {aiResult}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
