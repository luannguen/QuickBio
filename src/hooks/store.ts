import { create } from 'zustand';
import { authService } from '../services/authService';
import type { UserProfile } from '../services/authService';
import { bioService } from '../services/bioService';
import type { BioLink } from '../services/bioService';
import type { Product } from '../services/productService';

// ==========================================
// 1. Auth Store
// ==========================================
interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  initAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  initAuth: async () => {
    try {
      set({ loading: true });
      const user = await authService.getCurrentUser();
      set({ user, initialized: true });

      // Lắng nghe thay đổi trạng thái đăng nhập tự động
      const { supabase, isSupabaseConfigured } = await import('../services/supabase');
      if (isSupabaseConfigured && supabase) {
        supabase.auth.onAuthStateChange(async (event) => {
          console.log('Sự kiện Auth thay đổi:', event);
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
            const currentUser = await authService.getCurrentUser();
            set({ user: currentUser });
          } else if (event === 'SIGNED_OUT') {
            set({ user: null });
          }
        });
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    await authService.signOut();
    set({ user: null });
  }
}));

// ==========================================
// 2. Bio Builder Store (Trình quản lý thiết kế Bio)
// ==========================================
interface BioBuilderState {
  currentBio: BioLink | null;
  loading: boolean;
  saving: boolean;
  loadBio: (userId: string) => Promise<void>;
  updateBioFields: (fields: Partial<BioLink>) => void;
  updateTheme: (themeUpdates: Partial<BioLink['theme']>) => void;
  updateSocialLinks: (socialUpdates: Partial<BioLink['social_links']>) => void;
  saveBio: () => Promise<boolean>;
}

export const useBioBuilderStore = create<BioBuilderState>((set, get) => ({
  currentBio: null,
  loading: false,
  saving: false,
  loadBio: async (userId: string) => {
    set({ loading: true });
    try {
      let bio = await bioService.getBioByUserId(userId);
      if (!bio) {
        // Tự tạo mới nếu chưa có
        bio = await bioService.upsertBio(userId, {});
      }
      set({ currentBio: bio });
    } catch (err) {
      console.error('Failed to load bio:', err);
    } finally {
      set({ loading: false });
    }
  },
  updateBioFields: (fields) => {
    const { currentBio } = get();
    if (!currentBio) return;
    set({ currentBio: { ...currentBio, ...fields } });
  },
  updateTheme: (themeUpdates) => {
    const { currentBio } = get();
    if (!currentBio) return;
    set({
      currentBio: {
        ...currentBio,
        theme: { ...currentBio.theme, ...themeUpdates }
      }
    });
  },
  updateSocialLinks: (socialUpdates) => {
    const { currentBio } = get();
    if (!currentBio) return;
    set({
      currentBio: {
        ...currentBio,
        social_links: { ...currentBio.social_links, ...socialUpdates }
      }
    });
  },
  saveBio: async () => {
    const { currentBio } = get();
    if (!currentBio) return false;
    set({ saving: true });
    try {
      const updated = await bioService.upsertBio(currentBio.user_id, currentBio);
      if (updated) {
        set({ currentBio: updated });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save bio:', err);
      return false;
    } finally {
      set({ saving: false });
    }
  }
}));

// ==========================================
// 3. Cart Store (Quản lý mua hàng trên trang Bio công khai)
// ==========================================
interface CartState {
  isOpen: boolean;
  selectedProduct: Product | null;
  customerName: string;
  customerEmail: string;
  openCart: (product: Product) => void;
  closeCart: () => void;
  setCustomerInfo: (name: string, email: string) => void;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  selectedProduct: null,
  customerName: '',
  customerEmail: '',
  openCart: (product) => set({ selectedProduct: product, isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  setCustomerInfo: (name, email) => set({ customerName: name, customerEmail: email }),
  resetCart: () => set({ selectedProduct: null, isOpen: false })
}));

// ==========================================
// 4. Vapi Store (Quản lý trạng thái cuộc gọi thoại AI)
// ==========================================
interface VapiState {
  isCallActive: boolean;
  connecting: boolean;
  isListening: boolean;
  volume: number;
  startTrigger: number;
  stopTrigger: number;
  setCallActive: (active: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setListening: (listening: boolean) => void;
  setVolume: (volume: number) => void;
  triggerStart: () => void;
  triggerStop: () => void;
  resetCall: () => void;
}

export const useVapiStore = create<VapiState>((set) => ({
  isCallActive: false,
  connecting: false,
  isListening: false,
  volume: 0,
  startTrigger: 0,
  stopTrigger: 0,
  setCallActive: (active) => set({ isCallActive: active }),
  setConnecting: (connecting) => set({ connecting }),
  setListening: (listening) => set({ isListening: listening }),
  setVolume: (volume) => set({ volume }),
  triggerStart: () => set((state) => ({ startTrigger: state.startTrigger + 1, connecting: true })),
  triggerStop: () => set((state) => ({ stopTrigger: state.stopTrigger + 1 })),
  resetCall: () => set({ isCallActive: false, connecting: false, isListening: false, volume: 0 })
}));
