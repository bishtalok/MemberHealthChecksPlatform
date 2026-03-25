import { JourneyStatus } from '@prisma/client';
import { canTransition, validateTransition } from './journey-state-machine';
import { BadRequestException } from '@nestjs/common';

describe('JourneyStateMachine', () => {
  describe('canTransition', () => {
    it('should allow INITIATED -> CONSENT_GIVEN', () => {
      expect(canTransition(JourneyStatus.INITIATED, JourneyStatus.CONSENT_GIVEN)).toBe(true);
    });

    it('should allow CONSENT_GIVEN -> PRE_ASSESSMENT_COMPLETE', () => {
      expect(canTransition(JourneyStatus.CONSENT_GIVEN, JourneyStatus.PRE_ASSESSMENT_COMPLETE)).toBe(true);
    });

    it('should allow PRE_ASSESSMENT_COMPLETE -> BOOKED', () => {
      expect(canTransition(JourneyStatus.PRE_ASSESSMENT_COMPLETE, JourneyStatus.BOOKED)).toBe(true);
    });

    it('should allow BOOKED -> IN_PROGRESS', () => {
      expect(canTransition(JourneyStatus.BOOKED, JourneyStatus.IN_PROGRESS)).toBe(true);
    });

    it('should allow IN_PROGRESS -> RESULTS_READY', () => {
      expect(canTransition(JourneyStatus.IN_PROGRESS, JourneyStatus.RESULTS_READY)).toBe(true);
    });

    it('should allow RESULTS_READY -> COMPLETED', () => {
      expect(canTransition(JourneyStatus.RESULTS_READY, JourneyStatus.COMPLETED)).toBe(true);
    });

    it('should allow CANCELLED from any non-terminal state', () => {
      expect(canTransition(JourneyStatus.INITIATED, JourneyStatus.CANCELLED)).toBe(true);
      expect(canTransition(JourneyStatus.BOOKED, JourneyStatus.CANCELLED)).toBe(true);
      expect(canTransition(JourneyStatus.IN_PROGRESS, JourneyStatus.CANCELLED)).toBe(true);
    });

    it('should not allow COMPLETED -> any', () => {
      expect(canTransition(JourneyStatus.COMPLETED, JourneyStatus.CANCELLED)).toBe(false);
      expect(canTransition(JourneyStatus.COMPLETED, JourneyStatus.INITIATED)).toBe(false);
    });

    it('should not allow CANCELLED -> any', () => {
      expect(canTransition(JourneyStatus.CANCELLED, JourneyStatus.INITIATED)).toBe(false);
    });

    it('should not allow skipping steps', () => {
      expect(canTransition(JourneyStatus.INITIATED, JourneyStatus.BOOKED)).toBe(false);
      expect(canTransition(JourneyStatus.CONSENT_GIVEN, JourneyStatus.COMPLETED)).toBe(false);
    });
  });

  describe('validateTransition', () => {
    it('should not throw for valid transitions', () => {
      expect(() =>
        validateTransition(JourneyStatus.INITIATED, JourneyStatus.CONSENT_GIVEN),
      ).not.toThrow();
    });

    it('should throw BadRequestException for invalid transitions', () => {
      expect(() =>
        validateTransition(JourneyStatus.INITIATED, JourneyStatus.COMPLETED),
      ).toThrow(BadRequestException);
    });
  });
});
