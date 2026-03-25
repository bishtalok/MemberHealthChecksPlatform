import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JourneyStatus } from '@prisma/client';
import { HandoffDto } from './dto/handoff.dto';

@Injectable()
export class InsurerService {
  constructor(private readonly prisma: PrismaService) {}

  async handleHandoff(dto: HandoffDto) {
    // Mock eligibility check — always passes in prototype
    if (!dto.eligibility_token) {
      throw new BadRequestException('Invalid eligibility token');
    }

    // Find or create member
    let member = await this.prisma.member.findUnique({
      where: { insurer_member_id: dto.insurer_member_id },
    });

    if (!member) {
      member = await this.prisma.member.create({
        data: {
          insurer_member_id: dto.insurer_member_id,
          insurer_code: dto.insurer_code,
        },
      });
    }

    // Idempotency: return existing INITIATED journey if one exists
    const existingJourney = await this.prisma.healthCheckJourney.findFirst({
      where: {
        member_id: member.id,
        status: JourneyStatus.INITIATED,
      },
    });

    if (existingJourney) {
      return {
        journey_id: existingJourney.id,
        redirect_url: `/journey/${existingJourney.id}/consent`,
      };
    }

    // Create new journey
    const journey = await this.prisma.healthCheckJourney.create({
      data: {
        member_id: member.id,
        status: JourneyStatus.INITIATED,
      },
    });

    return {
      journey_id: journey.id,
      redirect_url: `/journey/${journey.id}/consent`,
    };
  }
}
