'use client';

import { useParams } from 'next/navigation';
import { useResults } from '@/hooks/use-results';
import { StepIndicator } from '@/components/step-indicator';
import { StatusBadge } from '@/components/status-badge';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useResults(id);

  const steps = [
    { label: 'Consent', status: 'completed' as const },
    { label: 'Pre-Assessment', status: 'completed' as const },
    { label: 'Book', status: 'completed' as const },
    { label: 'Results', status: 'current' as const },
  ];

  if (isLoading) {
    return (
      <div>
        <StepIndicator steps={steps} />
        <div className="text-center py-12">
          <div className="animate-pulse">Loading your results...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <StepIndicator steps={steps} />
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">
            Results Not Yet Available
          </h2>
          <p className="text-amber-700">
            Your health check results are being processed. Please check back
            after your in-store appointment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={steps} />

      <h1 className="text-2xl font-bold text-primary mb-2">
        Your Health Check Results
      </h1>
      <p className="text-muted-foreground mb-8">
        Here are your results, explained in plain English with recommended next
        steps.
      </p>

      {/* Result cards */}
      <div className="space-y-4 mb-10">
        {data.results.map((result) => (
          <div
            key={result.id}
            className="bg-white border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{result.metric}</h3>
              <StatusBadge status={result.status} />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-primary">
                {result.value}
              </span>
              <span className="text-muted-foreground">{result.unit}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.interpretation}
            </p>
          </div>
        ))}
      </div>

      {/* Next Best Actions */}
      <h2 className="text-xl font-bold text-primary mb-4">
        Recommended Next Steps
      </h2>
      <div className="space-y-3">
        {data.next_best_actions.map((action, i) => (
          <div
            key={i}
            className={`border rounded-lg p-5 ${
              action.type === 'consultation'
                ? 'border-red-200 bg-red-50'
                : action.type === 'follow_up'
                  ? 'border-amber-200 bg-amber-50'
                  : action.type === 'product'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-green-200 bg-green-50'
            }`}
          >
            <h3 className="font-semibold mb-1">{action.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {action.description}
            </p>
            <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:bg-boots-blue transition-colors">
              {action.cta_label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
