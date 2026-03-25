'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDailyList } from '@/hooks/use-daily-list';
import { useUpdateJourneyStatus } from '@/hooks/use-journey';
import { StatusBadge } from '@/components/status-badge';

const DEFAULT_STORE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export default function PharmacyPage() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: dailyList, isLoading, refetch } = useDailyList(DEFAULT_STORE_ID, date);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Daily Health Check Schedule</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading schedule...
        </div>
      ) : !dailyList || dailyList.length === 0 ? (
        <div className="bg-muted rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            No health checks scheduled for this date.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Time
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Member
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dailyList.map((item) => (
                <PharmacyRow
                  key={item.booking_id}
                  item={item}
                  onUpdate={() => refetch()}
                  onEnterResults={(journeyId) =>
                    router.push(`/pharmacy/results-entry/${journeyId}`)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PharmacyRow({
  item,
  onUpdate,
  onEnterResults,
}: {
  item: {
    booking_id: string;
    slot_start: string;
    slot_end: string;
    member_name: string;
    journey_type: string;
    journey_status: string;
    journey_id: string;
  };
  onUpdate: () => void;
  onEnterResults: (journeyId: string) => void;
}) {
  const updateStatus = useUpdateJourneyStatus(item.journey_id);

  const handleAction = async (status: string) => {
    await updateStatus.mutateAsync(status);
    onUpdate();
  };

  return (
    <tr className="border-b border-border hover:bg-muted/30">
      <td className="px-4 py-3 text-sm">
        {new Date(item.slot_start).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {' - '}
        {new Date(item.slot_end).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="px-4 py-3 text-sm font-medium">{item.member_name}</td>
      <td className="px-4 py-3 text-sm">
        {item.journey_type.replace(/_/g, ' ')}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={item.journey_status} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex gap-2 justify-end">
          {item.journey_status === 'BOOKED' && (
            <button
              onClick={() => handleAction('IN_PROGRESS')}
              disabled={updateStatus.isPending}
              className="px-3 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium hover:bg-amber-200"
            >
              Start Check
            </button>
          )}
          {item.journey_status === 'IN_PROGRESS' && (
            <button
              onClick={() => onEnterResults(item.journey_id)}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-boots-blue"
            >
              Enter Results
            </button>
          )}
          {item.journey_status === 'RESULTS_READY' && (
            <button
              onClick={() => handleAction('COMPLETED')}
              disabled={updateStatus.isPending}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
            >
              Mark Complete
            </button>
          )}
          {['BOOKED', 'IN_PROGRESS'].includes(item.journey_status) && (
            <button
              onClick={() => handleAction('CANCELLED')}
              disabled={updateStatus.isPending}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200"
            >
              No Show
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
