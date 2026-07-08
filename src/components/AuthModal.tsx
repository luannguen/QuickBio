import React, { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!supabase) throw new Error('Supabase not configured');

      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (signUpError) throw signUpError;
        
        // Ghi nhận người giới thiệu SaaS
        if (data.user) {
          const referrerId = localStorage.getItem('quickbio_referrer');
          if (referrerId && referrerId !== data.user.id) {
            await supabase
              .from('profiles')
              .update({ referred_by_creator: referrerId })
              .eq('id', data.user.id);
            localStorage.removeItem('quickbio_referrer');
          }
        }
        
        if (data.session) {
          onSuccess();
        } else {
          setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0F141E] border border-white/10 rounded-2xl shadow-2xl p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignUp ? 'Tạo gian hàng mới' : 'Đăng nhập Dashboard'}
        </h2>
        <p className="text-white/50 text-sm mb-6">
          {isSignUp 
            ? 'Bắt đầu hành trình kiếm tiền tự động của bạn' 
            : 'Chào mừng bạn quay lại hệ thống'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Họ và Tên</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                  placeholder="Nguyễn Văn A"
                />
                <span className="absolute left-3.5 top-3 text-white/40">
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Email</label>
            <div className="relative">
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                placeholder="email@example.com"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input 
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Đăng ký ngay' : 'Đăng nhập')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký mới'}
          </button>
        </div>
      </div>
    </div>
  );
};
