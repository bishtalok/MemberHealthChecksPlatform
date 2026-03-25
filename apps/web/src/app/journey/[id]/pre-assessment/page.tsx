'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSavePreAssessment } from '@/hooks/use-journey';
import { StepIndicator } from '@/components/step-indicator';
import { QUESTIONS } from '@/data/questionnaire';

export default function PreAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const saveMutation = useSavePreAssessment(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
  const isLast = currentIndex === QUESTIONS.length - 1;
  const currentAnswer = answers[question.id];
  const canProceed = !question.required || currentAnswer !== undefined;

  const steps = [
    { label: 'Consent', status: 'completed' as const },
    { label: 'Pre-Assessment', status: 'current' as const },
    { label: 'Book', status: 'upcoming' as const },
    { label: 'Results', status: 'upcoming' as const },
  ];

  const setAnswer = (value: string | number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = async () => {
    if (isLast) {
      await saveMutation.mutateAsync(answers);
      router.push(`/journey/${id}/book`);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  return (
    <div>
      <StepIndicator steps={steps} />

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{question.category}</span>
          <span>
            {currentIndex + 1} of {QUESTIONS.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white border border-border rounded-lg p-8 mb-6 min-h-[280px]">
        <h2 className="text-xl font-semibold mb-6">{question.text}</h2>

        {question.type === 'single-choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  currentAnswer === opt.value
                    ? 'border-primary bg-boots-light-blue'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value}
                  checked={currentAnswer === opt.value}
                  onChange={() => setAnswer(opt.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'yes-no' && (
          <div className="flex gap-4">
            {['yes', 'no'].map((val) => (
              <button
                key={val}
                onClick={() => setAnswer(val)}
                className={`flex-1 py-3 px-6 border rounded-lg font-medium transition-colors ${
                  currentAnswer === val
                    ? 'border-primary bg-boots-light-blue text-primary'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                {val === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        )}

        {question.type === 'numeric' && (
          <input
            type="number"
            min={question.min}
            max={question.max}
            value={currentAnswer ?? ''}
            onChange={(e) => setAnswer(Number(e.target.value))}
            className="w-full max-w-xs border border-border rounded-lg px-4 py-3 text-lg"
            placeholder="Enter a number"
          />
        )}

        {question.type === 'text' && (
          <textarea
            value={(currentAnswer as string) ?? ''}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full border border-border rounded-lg px-4 py-3 min-h-[100px]"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-6 py-2 border border-border rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed || saveMutation.isPending}
          className="px-8 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-boots-blue disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveMutation.isPending
            ? 'Saving...'
            : isLast
              ? 'Complete & Book'
              : 'Next'}
        </button>
      </div>
    </div>
  );
}
