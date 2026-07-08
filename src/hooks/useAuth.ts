import { useEffect } from 'react';
import { useAuthStore } from './store';

export const useAuth = () => {
  const { user, loading, initialized, initAuth, signOut } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initAuth();
    }
  }, [initialized, initAuth]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut
  };
};
export default useAuth;
