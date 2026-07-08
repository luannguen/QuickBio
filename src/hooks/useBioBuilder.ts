import { useBioBuilderStore } from './store';

export const useBioBuilder = () => {
  const {
    currentBio,
    loading,
    saving,
    loadBio,
    updateBioFields,
    updateTheme,
    updateSocialLinks,
    saveBio
  } = useBioBuilderStore();

  return {
    bio: currentBio,
    loading,
    saving,
    loadBio,
    updateBioFields,
    updateTheme,
    updateSocialLinks,
    saveBio
  };
};
export default useBioBuilder;
