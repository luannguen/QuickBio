import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { supabase } from "@/shared/api/supabase";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { ResponsiveModal } from "@/shared/ui/ResponsiveModal";

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
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignUp ? 'Tạo gian hàng mới' : 'Đăng nhập Dashboard'}
        </h2>
        <p className="text-white/60 text-sm">
          {isSignUp 
            ? 'Bắt đầu hành trình kiếm tiền tự động của bạn' 
            : 'Chào mừng bạn quay lại hệ thống'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
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
    </ResponsiveModal>
  );
};
