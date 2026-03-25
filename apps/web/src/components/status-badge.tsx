import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  INITIATED: 'bg-gray-100 text-gray-700',
  CONSENT_GIVEN: 'bg-blue-100 text-blue-700',
  PRE_ASSESSMENT_COMPLETE: 'bg-indigo-100 text-indigo-700',
  BOOKED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  RESULTS_READY: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-gray-100 text-gray-500',
  NORMAL: 'bg-green-100 text-green-700',
  BORDERLINE: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  INITIATED: 'Initiated',
  CONSENT_GIVEN: 'Consent Given',
  PRE_ASSESSMENT_COMPLETE: 'Pre-Assessment Done',
  BOOKED: 'Booked',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  RESULTS_READY: 'Results Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
  NORMAL: 'Normal',
  BORDERLINE: 'Borderline',
  HIGH: 'High',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        STATUS_STYLES[status] || 'bg-gray-100 text-gray-700',
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
