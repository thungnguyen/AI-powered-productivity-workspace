'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // Wait for hydration
    const unsub = useAuthStore.persist.onHydrate(() => setIsHydrated(false));
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));

    setIsHydrated(useAuthStore.persist.hasHydrated());

    return () => {
      unsub();
      unsubFinish();
    };
  }, []);

  React.useEffect(() => {
    if (isHydrated) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isHydrated, isAuthenticated, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm font-medium text-muted-foreground">Redirecting...</span>
      </div>
    </div>
  );
}
