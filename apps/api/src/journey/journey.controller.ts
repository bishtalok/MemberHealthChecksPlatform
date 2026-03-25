import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JourneyStatus } from '@prisma/client';
import { JourneyService } from './journey.service';

@ApiTags('Journey')
@Controller('api/journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get journey by ID' })
  async getJourney(@Param('id') id: string) {
    return this.journeyService.getJourney(id);
  }

  @Patch(':id/consent')
  @ApiOperation({ summary: 'Record member consent' })
  async recordConsent(
    @Param('id') id: string,
    @Body()
    body: {
      data_processing: boolean;
      health_data_sharing: boolean;
      marketing?: boolean;
      consent_version: string;
    },
  ) {
    return this.journeyService.recordConsent(id, body);
  }

  @Patch(':id/pre-assessment')
  @ApiOperation({ summary: 'Save pre-assessment answers' })
  async savePreAssessment(
    @Param('id') id: string,
    @Body() body: { answers: Record<string, unknown> },
  ) {
    return this.journeyService.savePreAssessment(id, body.answers);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update journey status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: JourneyStatus },
  ) {
    return this.journeyService.updateStatus(id, body.status);
  }
}
