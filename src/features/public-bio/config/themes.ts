export interface ThemeConfig {
  id: string;
  name: string;
  type: 'dark' | 'light';
  colors: {
    background: string;
    text: string;
    accent: string;
    cardBg: string;
    cardBorder: string;
    cardText: string;
    buttonBg: string;
    buttonText: string;
  };
  styles: {
    fontFamily: string;
    glassmorphism: boolean;
    backgroundImage?: string;
  };
}

export const BIO_THEMES: Record<string, ThemeConfig> = {
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism (Mặc định)',
    type: 'dark',
    colors: {
      background: '#09090b',
      text: '#ffffff',
      accent: '#FF4500', // brand-orange
      cardBg: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardText: '#ffffff',
      buttonBg: 'rgba(255, 255, 255, 0.1)',
      buttonText: '#ffffff',
    },
    styles: {
      fontFamily: 'Inter, sans-serif',
      glassmorphism: true,
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1a1a1a 0%, #000000 100%)'
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist (Sạch sẽ)',
    type: 'light',
    colors: {
      background: '#ffffff',
      text: '#111827', // gray-900
      accent: '#000000',
      cardBg: '#f3f4f6', // gray-100
      cardBorder: '#e5e7eb', // gray-200
      cardText: '#1f2937', // gray-800
      buttonBg: '#f3f4f6',
      buttonText: '#1f2937',
    },
    styles: {
      fontFamily: 'Inter, sans-serif',
      glassmorphism: false,
    }
  },
  dark_mode: {
    id: 'dark_mode',
    name: 'Dark Mode (Chuyên nghiệp)',
    type: 'dark',
    colors: {
      background: '#121212',
      text: '#f3f4f6', // gray-100
      accent: '#3b82f6', // blue-500
      cardBg: '#1f2937', // gray-800
      cardBorder: '#374151', // gray-700
      cardText: '#f3f4f6',
      buttonBg: '#374151',
      buttonText: '#f3f4f6',
    },
    styles: {
      fontFamily: 'Inter, sans-serif',
      glassmorphism: false,
    }
  },
  neon_y2k: {
    id: 'neon_y2k',
    name: 'Neon Y2K (Phát sáng)',
    type: 'dark',
    colors: {
      background: '#050014',
      text: '#ffffff',
      accent: '#ff00ff', // magenta
      cardBg: 'rgba(20, 0, 40, 0.6)',
      cardBorder: '#ff00ff',
      cardText: '#ffffff',
      buttonBg: 'transparent',
      buttonText: '#00ffff', // cyan
    },
    styles: {
      fontFamily: '"Space Grotesk", sans-serif',
      glassmorphism: true,
      backgroundImage: 'linear-gradient(45deg, #050014 0%, #1a0033 100%)'
    }
  },
  gradient: {
    id: 'gradient',
    name: 'Sunset Gradient',
    type: 'dark',
    colors: {
      background: '#ff7e5f',
      text: '#ffffff',
      accent: '#ffffff',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      cardBorder: 'rgba(255, 255, 255, 0.3)',
      cardText: '#ffffff',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonText: '#ffffff',
    },
    styles: {
      fontFamily: 'Inter, sans-serif',
      glassmorphism: true,
      backgroundImage: 'linear-gradient(to right, #ff7e5f, #feb47b)'
    }
  }
};
