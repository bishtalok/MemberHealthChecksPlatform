'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface ResultsResponse {
  journey_id: string;
  results: Array<{
    id: string;
    metric: string;
    value: number;
    unit: string;
    status: string;
    interpretation: string;
    recorded_at: string;
  }>;
  next_best_actions: Array<{
    type: string;
    title: string;
    description: string;
    cta_label: string;
    cta_url: string;
    priority: number;
  }>;
}

export function useResults(journeyId: string) {
  return useQuery({
    queryKey: ['results', journeyId],
    queryFn: () => apiClient<ResultsResponse>(`/results/${journeyId}`),
    enabled: !!journeyId,
  });
}
