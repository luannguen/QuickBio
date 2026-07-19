import React from 'react';
import { Skeleton } from '@/shared/ui/Skeleton';

export const PublicBioSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-8 mt-12">
        {/* Avatar & Info */}
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="w-48 h-8 rounded-md" />
          <Skeleton className="w-64 h-4 rounded-md" />
        </div>

        {/* Links */}
        <div className="flex justify-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>

        {/* Products / Articles */}
        <div className="space-y-4 pt-8">
          <Skeleton className="w-32 h-6 rounded-md mb-4" />
          <Skeleton className="w-full h-24 rounded-2xl" />
          <Skeleton className="w-full h-24 rounded-2xl" />
          <Skeleton className="w-full h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
