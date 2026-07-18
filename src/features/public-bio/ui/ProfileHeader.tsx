import React from 'react';
import { Sparkles } from 'lucide-react';

interface ProfileHeaderProps {
  avatarUrl: string | null;
  title: string;
  bioText: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatarUrl, title, bioText }) => {
  return (
    <div className="text-center space-y-4 animate-float-slow">
      <div className="relative inline-block group">
        <div className="absolute -inset-1.5 rounded-full blur-[10px] opacity-60 group-hover:opacity-85 transition-opacity duration-500" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
        <img 
          src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'} 
          alt={title} 
          className="relative w-24 h-24 rounded-full object-cover border-4 mx-auto shadow-2xl transition-transform duration-500 group-hover:scale-105"
          style={{ borderColor: 'var(--theme-card-bg)' }}
        />
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 text-white shadow-lg" style={{ backgroundColor: 'var(--theme-accent)', borderColor: 'var(--theme-card-bg)' }}>
          <Sparkles className="w-3 h-3 animate-spin-slow" />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--theme-card-text)' }}>{title}</h1>
        <p className="text-sm opacity-70 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--theme-card-text)' }}>{bioText}</p>
      </div>
    </div>
  );
};
