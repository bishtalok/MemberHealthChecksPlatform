import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, JourneyStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { validateTransition } from './journey-state-machine';

@Injectable()
export class JourneyService {
  constructor(private readonly prisma: PrismaService) {}

  async getJourney(id: string) {
    const journey = await this.prisma.healthCheckJourney.findUnique({
      where: { id },
      include: {
        member: true,
        booking: { include: { store: true, slot: true } },
        results: true,
      },
    });

    if (!journey) {
      throw new NotFoundException(`Journey ${id} not found`);
    }

    return journey;
  }

  async recordConsent(
    id: string,
    consent: {
      data_processing: boolean;
      health_data_sharing: boolean;
      marketing?: boolean;
      consent_version: string;
    },
  ) {
    const journey = await this.getJourney(id);
    validateTransition(journey.status, JourneyStatus.CONSENT_GIVEN);

    // Update member consent
    await this.prisma.member.update({
      where: { id: journey.member_id },
      data: {
        consent_given_at: new Date(),
        consent_version: consent.consent_version,
      },
    });

    return this.prisma.healthCheckJourney.update({
      where: { id },
      data: { status: JourneyStatus.CONSENT_GIVEN },
      include: { member: true },
    });
  }

  async savePreAssessment(id: string, answers: Record<string, unknown>) {
    const journey = await this.getJourney(id);
    validateTransition(journey.status, JourneyStatus.PRE_ASSESSMENT_COMPLETE);

    return this.prisma.healthCheckJourney.update({
      where: { id },
      data: {
        pre_assessment: answers as Prisma.InputJsonValue,
        status: JourneyStatus.PRE_ASSESSMENT_COMPLETE,
      },
    });
  }

  async updateStatus(id: string, newStatus: JourneyStatus) {
    const journey = await this.getJourney(id);
    validateTransition(journey.status, newStatus);

    return this.prisma.healthCheckJourney.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
