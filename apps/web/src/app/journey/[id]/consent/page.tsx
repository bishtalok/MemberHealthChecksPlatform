'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJourney, useRecordConsent } from '@/hooks/use-journey';
import { StepIndicator } from '@/components/step-indicator';

export default function ConsentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: journey, isLoading } = useJourney(id);
  const consentMutation = useRecordConsent(id);

  const [dataProcessing, setDataProcessing] = useState(false);
  const [healthDataSharing, setHealthDataSharing] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const steps = [
    { label: 'Consent', status: 'current' as const },
    { label: 'Pre-Assessment', status: 'upcoming' as const },
    { label: 'Book', status: 'upcoming' as const },
    { label: 'Results', status: 'upcoming' as const },
  ];

  const canSubmit = dataProcessing && healthDataSharing;

  const handleSubmit = async () => {
    await consentMutation.mutateAsync({
      data_processing: dataProcessing,
      health_data_sharing: healthDataSharing,
      marketing,
      consent_version: '1.0',
    });
    router.push(`/journey/${id}/pre-assessment`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={steps} />

      <div className="bg-boots-light-blue border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-boots-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">{'\u2713'}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Eligibility Confirmed
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your insurer has confirmed you are eligible for a Boots Health Check.
              You can now begin your health check journey.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-2">
        Welcome to Your Boots Health Check
      </h1>
      <p className="text-muted-foreground mb-8">
        Before we begin, we need your consent to process your health information.
        Please read and agree to the following.
      </p>

      <div className="space-y-4 mb-8">
        <label className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
          <input
            type="checkbox"
            checked={dataProcessing}
            onChange={(e) => setDataProcessing(e.target.checked)}
            className="mt-1 w-5 h-5 accent-primary"
          />
          <div>
            <span className="font-medium">
              Data Processing Consent <span className="text-red-500">*</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              I consent to Boots processing my personal data for the purpose of
              delivering my health check and providing results.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
          <input
            type="checkbox"
            checked={healthDataSharing}
            onChange={(e) => setHealthDataSharing(e.target.checked)}
            className="mt-1 w-5 h-5 accent-primary"
          />
          <div>
            <span className="font-medium">
              Health Data Sharing <span className="text-red-500">*</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              I consent to my health check results being shared with the Boots
              pharmacist conducting my check and stored securely for my records.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="mt-1 w-5 h-5 accent-primary"
          />
          <div>
            <span className="font-medium">Marketing Communications</span>
            <span className="text-sm text-muted-foreground ml-2">(Optional)</span>
            <p className="text-sm text-muted-foreground mt-1">
              I would like to receive personalised health tips and product
              recommendations from Boots.
            </p>
          </div>
        </label>
      </div>

      <p className="text-xs text-muted-foreground mb-6">
        Consent Version 1.0 | Your data will be processed in accordance with
        GDPR regulations and our privacy policy.
      </p>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || consentMutation.isPending}
        className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-boots-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {consentMutation.isPending ? 'Processing...' : 'Start My Health Check'}
      </button>

      {consentMutation.isError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Failed to record consent. Please try again.
        </p>
      )}
    </div>
  );
}
