'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: () => apiClient<Array<{ id: string; name: string; address: string; city: string; postcode: string }>>('/booking/stores'),
  });
}

export function useSlots(storeId: string, date: string) {
  return useQuery({
    queryKey: ['slots', storeId, date],
    queryFn: () =>
      apiClient<Array<{ id: string; start_time: string; end_time: string; available: boolean }>>(
        `/booking/slots?store_id=${storeId}&date=${date}`,
      ),
    enabled: !!storeId && !!date,
    refetchInterval: 30000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { journey_id: string; store_id: string; slot_id: string }) =>
      apiClient('/booking', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}
