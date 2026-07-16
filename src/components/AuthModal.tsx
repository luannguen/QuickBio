import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { supabase } from "@/shared/api/supabase";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Card } from "@/shared/ui/Card";

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="relative w-full max-w-md p-6 animate-fade-in border-brand-dark/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignUp ? 'Tạo gian hàng mới' : 'Đăng nhập Dashboard'}
        </h2>
        <p className="text-semantic-muted text-sm mb-6">
          {isSignUp 
            ? 'Bắt đầu hành trình kiếm tiền tự động của bạn' 
            : 'Chào mừng bạn quay lại hệ thống'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-semantic-error/10 border border-semantic-error/20 text-semantic-error text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-semantic-success/10 border border-semantic-success/20 text-semantic-success text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label className="block mb-1.5">Họ và Tên</Label>
              <div className="relative">
                <Input 
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="pl-10"
                  placeholder="Nguyễn Văn A"
                />
                <span className="absolute left-3.5 top-3 text-white/40">
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                </span>
              </div>
            </div>
          )}

          <div>
            <Label className="block mb-1.5">Email</Label>
            <div className="relative">
              <Input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                placeholder="email@example.com"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
            </div>
          </div>

          <div>
            <Label className="block mb-1.5">Mật khẩu</Label>
            <div className="relative">
              <Input 
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
            </div>
          </div>

          <Button 
            type="submit"
            isLoading={loading}
            className="w-full mt-2 h-12 text-md"
          >
            {isSignUp ? 'Đăng ký ngay' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button 
            type="button"
            variant="link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-sm text-white/60 hover:text-white"
          >
            {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký mới'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
