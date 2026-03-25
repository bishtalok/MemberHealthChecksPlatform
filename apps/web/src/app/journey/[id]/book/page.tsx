'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStores, useSlots, useCreateBooking } from '@/hooks/use-booking';
import { StepIndicator } from '@/components/step-indicator';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [selectedStore, setSelectedStore] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const { data: stores } = useStores();
  const { data: slots, isLoading: slotsLoading } = useSlots(selectedStore, selectedDate);
  const bookingMutation = useCreateBooking();

  const steps = [
    { label: 'Consent', status: 'completed' as const },
    { label: 'Pre-Assessment', status: 'completed' as const },
    { label: 'Book', status: 'current' as const },
    { label: 'Results', status: 'upcoming' as const },
  ];

  // Generate next 7 weekdays
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 10 && dates.length < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  const handleBook = async () => {
    const result = await bookingMutation.mutateAsync({
      journey_id: id,
      store_id: selectedStore,
      slot_id: selectedSlot,
    });
    setConfirmed(true);
  };

  const selectedSlotData = slots?.find((s: { id: string }) => s.id === selectedSlot);
  const selectedStoreData = stores?.find((s: { id: string }) => s.id === selectedStore);

  if (confirmed) {
    return (
      <div>
        <StepIndicator steps={steps} />
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-boots-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">{'\u2713'}</span>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-green-700 mb-6">
            Your health check has been booked successfully.
          </p>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-left space-y-2">
            <p>
              <span className="font-medium">Store:</span>{' '}
              {selectedStoreData?.name}
            </p>
            <p>
              <span className="font-medium">Date:</span> {selectedDate}
            </p>
            {selectedSlotData && (
              <p>
                <span className="font-medium">Time:</span>{' '}
                {new Date(selectedSlotData.start_time).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' - '}
                {new Date(selectedSlotData.end_time).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            You will receive a confirmation notification. Please arrive 5
            minutes before your appointment.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            After your in-store check, your results will appear on the{' '}
            <button
              onClick={() => router.push(`/journey/${id}/results`)}
              className="text-primary underline"
            >
              Results page
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={steps} />

      <h1 className="text-2xl font-bold text-primary mb-2">
        Book Your Health Check
      </h1>
      <p className="text-muted-foreground mb-8">
        Choose a convenient Boots store, date, and time for your health check.
      </p>

      {/* Store selection */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Select Store</label>
        <select
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
            setSelectedSlot('');
          }}
          className="w-full border border-border rounded-lg px-4 py-3"
        >
          <option value="">Choose a store...</option>
          {stores?.map((store: { id: string; name: string; address: string; postcode: string }) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.postcode}
            </option>
          ))}
        </select>
      </div>

      {/* Date selection */}
      {selectedStore && (
        <div className="mb-6">
          <label className="block font-medium mb-2">Select Date</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {dates.map((date) => {
              const d = new Date(date + 'T00:00:00');
              return (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot('');
                  }}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedDate === date
                      ? 'border-primary bg-boots-light-blue'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="text-xs text-muted-foreground">
                    {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                  </div>
                  <div className="font-semibold">
                    {d.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Time slots */}
      {selectedStore && selectedDate && (
        <div className="mb-8">
          <label className="block font-medium mb-2">Select Time</label>
          {slotsLoading ? (
            <p className="text-muted-foreground">Loading available slots...</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots?.map((slot: { id: string; start_time: string; available: boolean }) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                  className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSlot === slot.id
                      ? 'border-primary bg-boots-light-blue text-primary'
                      : slot.available
                        ? 'border-border hover:bg-muted/50'
                        : 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                  }`}
                >
                  {new Date(slot.start_time).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book button */}
      <button
        onClick={handleBook}
        disabled={!selectedSlot || bookingMutation.isPending}
        className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-boots-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
      </button>

      {bookingMutation.isError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          {(bookingMutation.error as Error).message || 'Failed to book. Please try again.'}
        </p>
      )}
    </div>
  );
}
