import React from 'react';
import { SocialIcon } from '../components/SocialIcon';
import { analyticsService } from '@/entities/analytics/api';

interface SocialLinksProps {
  socialLinks: Record<string, any>;
  userId?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, userId }) => {
  const links = Object.entries(socialLinks).filter(([_, url]) => !!url);

  if (links.length === 0) return null;

  const handleTrackClick = (platform: string) => {
    if (userId) {
      analyticsService.logEvent({
        user_id: userId,
        event_type: 'CLICK',
        block_id: `social_${platform}`,
      });
    }
  };

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {links.map(([key, url]) => (
        <a 
          key={key} 
          href={url as string} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`Ghé thăm trang ${key}`}
          onClick={() => handleTrackClick(key)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md"
          style={{ 
            backgroundColor: 'var(--theme-card-bg)', 
            borderColor: 'var(--theme-card-border)',
            color: 'var(--theme-card-text)'
          }}
        >
          <SocialIcon platform={key} />
        </a>
      ))}
    </div>
  );
};
