'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/polls');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Redirecting to Polls...
        </h1>
        <p className="text-muted-foreground">
          Please wait while we redirect you to the polls dashboard.
        </p>
      </div>
    </div>
  );
}
