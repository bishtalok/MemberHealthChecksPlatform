'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useJourney(id: string) {
  return useQuery({
    queryKey: ['journey', id],
    queryFn: () => apiClient(`/journey/${id}`),
    enabled: !!id,
  });
}

export function useRecordConsent(journeyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consent: {
      data_processing: boolean;
      health_data_sharing: boolean;
      marketing?: boolean;
      consent_version: string;
    }) =>
      apiClient(`/journey/${journeyId}/consent`, {
        method: 'PATCH',
        body: JSON.stringify(consent),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey', journeyId] });
    },
  });
}

export function useSavePreAssessment(journeyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answers: Record<string, unknown>) =>
      apiClient(`/journey/${journeyId}/pre-assessment`, {
        method: 'PATCH',
        body: JSON.stringify({ answers }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey', journeyId] });
    },
  });
}

export function useUpdateJourneyStatus(journeyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) =>
      apiClient(`/journey/${journeyId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        role: 'pharmacist',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey', journeyId] });
    },
  });
}
