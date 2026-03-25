'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

function EntryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const insurer = searchParams.get('insurer');
    const memberId = searchParams.get('member_id');

    if (!token || !insurer || !memberId) {
      setError('Missing required parameters. Please access this page via your insurer app.');
      setLoading(false);
      return;
    }

    apiClient<{ journey_id: string; redirect_url: string }>('/insurer/handoff', {
      method: 'POST',
      body: JSON.stringify({
        eligibility_token: token,
        insurer_code: insurer,
        insurer_member_id: memberId,
      }),
    })
      .then((res) => {
        router.push(res.redirect_url);
      })
      .catch((err) => {
        setError(err.message || 'Failed to process handoff');
        setLoading(false);
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Start Journey
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto" />
          <h2 className="text-lg font-semibold text-primary">
            Verifying your eligibility...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your details.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function EntryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto" />
            <h2 className="text-lg font-semibold text-primary">Loading...</h2>
          </div>
        </div>
      }
    >
      <EntryContent />
    </Suspense>
  );
}
