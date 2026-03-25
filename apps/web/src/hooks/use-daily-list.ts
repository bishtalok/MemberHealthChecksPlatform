'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface DailyListItem {
  booking_id: string;
  slot_start: string;
  slot_end: string;
  member_name: string;
  journey_type: string;
  journey_status: string;
  journey_id: string;
  booking_status: string;
}

export function useDailyList(storeId: string, date?: string) {
  const params = new URLSearchParams();
  if (storeId) params.set('store_id', storeId);
  if (date) params.set('date', date);

  return useQuery({
    queryKey: ['daily-list', storeId, date],
    queryFn: () =>
      apiClient<DailyListItem[]>(`/pharmacy/daily-list?${params.toString()}`, {
        role: 'pharmacist',
      }),
    enabled: !!storeId,
    refetchInterval: 30000,
  });
}
