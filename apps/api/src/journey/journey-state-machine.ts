import { BadRequestException } from '@nestjs/common';
import { JourneyStatus } from '@prisma/client';

const VALID_TRANSITIONS: Record<JourneyStatus, JourneyStatus[]> = {
  [JourneyStatus.INITIATED]: [JourneyStatus.CONSENT_GIVEN, JourneyStatus.CANCELLED],
  [JourneyStatus.CONSENT_GIVEN]: [JourneyStatus.PRE_ASSESSMENT_COMPLETE, JourneyStatus.CANCELLED],
  [JourneyStatus.PRE_ASSESSMENT_COMPLETE]: [JourneyStatus.BOOKED, JourneyStatus.CANCELLED],
  [JourneyStatus.BOOKED]: [JourneyStatus.IN_PROGRESS, JourneyStatus.CANCELLED],
  [JourneyStatus.IN_PROGRESS]: [JourneyStatus.RESULTS_READY, JourneyStatus.CANCELLED],
  [JourneyStatus.RESULTS_READY]: [JourneyStatus.COMPLETED, JourneyStatus.CANCELLED],
  [JourneyStatus.COMPLETED]: [],
  [JourneyStatus.CANCELLED]: [],
};

export function canTransition(from: JourneyStatus, to: JourneyStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateTransition(from: JourneyStatus, to: JourneyStatus): void {
  if (!canTransition(from, to)) {
    throw new BadRequestException(
      `Invalid status transition: ${from} -> ${to}`,
    );
  }
}
