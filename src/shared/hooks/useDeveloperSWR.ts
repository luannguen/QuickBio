import useSWR from 'swr';
import { developerService } from '@/entities/developer/api';
import type { DevArtifact, DevTaskContext, DevSystemChange, DevFeatureFlag } from '@/entities/developer/api.types';

export const useDevArtifacts = (shouldFetch: boolean = true) => {
  const { data, error, isLoading, mutate } = useSWR<DevArtifact[]>(
    shouldFetch ? 'dev_artifacts' : null,
    developerService.getArtifacts,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate
  };
};

export const useDevTaskContexts = (shouldFetch: boolean = true) => {
  const { data, error, isLoading, mutate } = useSWR<DevTaskContext[]>(
    shouldFetch ? 'dev_task_contexts' : null,
    developerService.getTaskContexts,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate
  };
};

export const useDevSystemChanges = (shouldFetch: boolean = true) => {
  const { data, error, isLoading, mutate } = useSWR<DevSystemChange[]>(
    shouldFetch ? 'dev_system_changes' : null,
    developerService.getSystemChanges,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate
  };
};

export const useDevFeatureFlags = (shouldFetch: boolean = true) => {
  const { data, error, isLoading, mutate } = useSWR<DevFeatureFlag[]>(
    shouldFetch ? 'dev_feature_flags' : null,
    developerService.getFeatureFlags,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate
  };
};
