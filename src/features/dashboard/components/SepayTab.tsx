import React from 'react';
import { Settings, Check, Key, Info, ExternalLink } from 'lucide-react';

interface SepayTabProps {
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
}

export const SepayTab: React.FC<SepayTabProps> = ({
  bankCode,
  onBankCodeChange,
  bankAccount,
  onBankAccountChange,
  accountName,
  onAccountNameChange,
  apiKey,
  onApiKeyChange,
  configSuccess,
  onSaveBankConfig
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold flex items-center gap-2">
        <Settings className="w-5 h-5 text-brand-orange" />
        Cấu hình Cổng thanh toán VietQR & Ngân hàng
      </h3>

      <form onSubmit={onSaveBankConfig} className="glass-card p-6 rounded-2xl border border-border space-y-6">
        
        {configSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            Lưu cấu hình ngân hàng thành công!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">Ngân hàng thụ hưởng</label>
            <select 
              value={bankCode}
              onChange={(e) => onBankCodeChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground bg-background border border-border outline-none focus:border-brand-orange/40"
            >
              <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
              <option value="Vietcombank">Vietcombank (VCB)</option>
              <option value="Techcombank">Techcombank (TCB)</option>
              <option value="Vietinbank">Vietinbank</option>
              <option value="ACB">ACB</option>
              <option value="VPBank">VPBank</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">Số tài khoản ngân hàng</label>
            <input 
              type="text" 
              value={bankAccount}
              onChange={(e) => onBankAccountChange(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Ví dụ: 9999999999"
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">Họ và Tên chủ tài khoản (Viết hoa không dấu)</label>
            <input 
              type="text" 
              value={accountName}
              onChange={(e) => onAccountNameChange(e.target.value.toUpperCase())}
              placeholder="NGUYEN VAN A"
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-brand-orange" />
              SePay Webhook API Key
            </label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Để trống nếu muốn dùng Webhook Simulator"
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
            />
          </div>
        </div>

        <div className="bg-brand-card/40 p-4 rounded-xl border border-border space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Info className="w-4 h-4 text-brand-orange" />
            Hướng dẫn nhận tiền tự động bằng SePay (Miễn phí):
          </h4>
          <ol className="text-[11px] text-muted-foreground list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li>Truy cập <a href="https://sepay.vn" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline">SePay.vn <ExternalLink className="w-3 h-3 inline" /></a> và đăng ký tài khoản (Free).</li>
            <li>Liên kết tài khoản ngân hàng của bạn vào SePay.</li>
            <li>Tạo Webhook trong SePay, trỏ URL webhook về: <code className="text-brand-orange bg-muted/50 px-1 py-0.5 rounded select-all font-mono">https://quickbio.vercel.app/api/webhook</code></li>
            <li>Copy API Key SePay và dán vào ô bên trên để xác thực giao dịch an toàn.</li>
          </ol>
        </div>

        <button 
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 transform active:scale-95 touch-target min-h-[40px]"
        >
          Lưu cấu hình
        </button>
      </form>
    </div>
  );
};
