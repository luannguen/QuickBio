import React from 'react';
import { SocialIcon } from '../components/SocialIcon';

interface SocialLinksProps {
  socialLinks: Record<string, any>;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks }) => {
  const links = Object.entries(socialLinks).filter(([_, url]) => !!url);

  if (links.length === 0) return null;

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {links.map(([key, url]) => (
        <a 
          key={key} 
          href={url as string} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`Ghé thăm trang ${key}`}
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] hover:bg-gradient-to-tr hover:from-brand-orange/20 hover:to-brand-coral/20 border border-white/5 hover:border-brand-orange/30 text-white/70 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-brand-orange/5"
        >
          <SocialIcon platform={key} />
        </a>
      ))}
    </div>
  );
};
