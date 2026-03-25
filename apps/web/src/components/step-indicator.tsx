'use client';

import { cn } from '@/lib/utils';

interface Step {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function StepIndicator({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                step.status === 'completed' && 'bg-boots-green text-white',
                step.status === 'current' && 'bg-primary text-primary-foreground',
                step.status === 'upcoming' && 'bg-muted text-muted-foreground',
              )}
            >
              {step.status === 'completed' ? '\u2713' : i + 1}
            </div>
            <span
              className={cn(
                'text-xs mt-1',
                step.status === 'current' ? 'font-semibold text-primary' : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'w-12 h-0.5 mx-2 mt-[-16px]',
                step.status === 'completed' ? 'bg-boots-green' : 'bg-muted',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
