'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface MetricEntry {
  metric: string;
  value: string;
  unit: string;
  thresholds: { normal: number; borderline: number };
}

const METRICS: MetricEntry[] = [
  {
    metric: 'Systolic Blood Pressure',
    value: '',
    unit: 'mmHg',
    thresholds: { normal: 120, borderline: 140 },
  },
  {
    metric: 'Diastolic Blood Pressure',
    value: '',
    unit: 'mmHg',
    thresholds: { normal: 80, borderline: 90 },
  },
  {
    metric: 'Total Cholesterol',
    value: '',
    unit: 'mmol/L',
    thresholds: { normal: 5.0, borderline: 6.2 },
  },
  {
    metric: 'Blood Glucose',
    value: '',
    unit: 'mmol/L',
    thresholds: { normal: 5.5, borderline: 7.0 },
  },
  {
    metric: 'BMI',
    value: '',
    unit: 'kg/m\u00B2',
    thresholds: { normal: 25, borderline: 30 },
  },
];

function getStatus(
  value: number,
  thresholds: { normal: number; borderline: number },
): string {
  if (value < thresholds.normal) return 'NORMAL';
  if (value < thresholds.borderline) return 'BORDERLINE';
  return 'HIGH';
}

export default function ResultsEntryPage() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const router = useRouter();

  const [metrics, setMetrics] = useState(METRICS);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateMetric = (index: number, value: string) => {
    setMetrics((prev) =>
      prev.map((m, i) => (i === index ? { ...m, value } : m)),
    );
  };

  const handleSubmit = async () => {
    const results = metrics
      .filter((m) => m.value !== '')
      .map((m) => ({
        metric: m.metric,
        value: parseFloat(m.value),
        unit: m.unit,
        status: getStatus(parseFloat(m.value), m.thresholds),
      }));

    if (results.length === 0) {
      setError('Please enter at least one result.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await apiClient('/results', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          pharmacist_id: 'user-pharmacist-001',
          results,
          notes: notes || undefined,
        }),
        role: 'pharmacist',
      });
      router.push('/pharmacy');
    } catch (err) {
      setError((err as Error).message || 'Failed to submit results');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-primary mb-2">
        Enter Health Check Results
      </h2>
      <p className="text-muted-foreground mb-8">
        Record the measurements from the health check. Status is calculated
        automatically based on clinical thresholds.
      </p>

      <div className="space-y-4 mb-8">
        {metrics.map((metric, i) => {
          const val = parseFloat(metric.value);
          const status = metric.value
            ? getStatus(val, metric.thresholds)
            : null;

          return (
            <div
              key={metric.metric}
              className="bg-white border border-border rounded-lg p-4"
            >
              <label className="block font-medium mb-2">{metric.metric}</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={metric.value}
                  onChange={(e) => updateMetric(i, e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 w-32"
                  placeholder="0"
                />
                <span className="text-muted-foreground text-sm">
                  {metric.unit}
                </span>
                {status && (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      status === 'NORMAL'
                        ? 'bg-green-100 text-green-700'
                        : status === 'BORDERLINE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {status}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Normal: &lt;{metric.thresholds.normal} | Borderline:{' '}
                {metric.thresholds.normal}-{metric.thresholds.borderline} | High:
                &gt;{metric.thresholds.borderline}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <label className="block font-medium mb-2">Pharmacist Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-3 min-h-[100px]"
          placeholder="Additional observations or notes..."
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/pharmacy')}
          className="px-6 py-2 border border-border rounded-md hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-boots-blue disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Results'}
        </button>
      </div>
    </div>
  );
}
