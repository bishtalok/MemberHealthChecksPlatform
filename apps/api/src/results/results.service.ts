import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JourneyStatus, ResultStatus } from '@prisma/client';
import { validateTransition } from '../journey/journey-state-machine';
import { SubmitResultsDto } from './dto/results.dto';
import { NextBestAction } from '@mhc/shared-types';

const METRIC_INTERPRETATIONS: Record<string, Record<ResultStatus, string>> = {
  'Systolic Blood Pressure': {
    NORMAL: 'Your systolic blood pressure is within a healthy range. Keep up your current lifestyle habits.',
    BORDERLINE: 'Your systolic blood pressure is slightly elevated. Consider reducing salt intake and increasing physical activity.',
    HIGH: 'Your systolic blood pressure is high. We recommend speaking with a healthcare professional promptly.',
  },
  'Diastolic Blood Pressure': {
    NORMAL: 'Your diastolic blood pressure is within a healthy range.',
    BORDERLINE: 'Your diastolic blood pressure is slightly elevated. Monitor regularly and consider lifestyle changes.',
    HIGH: 'Your diastolic blood pressure is high. Please consult a healthcare professional.',
  },
  'Total Cholesterol': {
    NORMAL: 'Your cholesterol levels are healthy. Maintain a balanced diet rich in fruits and vegetables.',
    BORDERLINE: 'Your cholesterol is slightly elevated. Consider reducing saturated fats in your diet.',
    HIGH: 'Your cholesterol is high. We recommend consulting with your GP about management options.',
  },
  'Blood Glucose': {
    NORMAL: 'Your blood glucose level is within the normal range.',
    BORDERLINE: 'Your blood glucose is slightly elevated. Consider monitoring your sugar intake.',
    HIGH: 'Your blood glucose is elevated. Please speak with a healthcare professional about further testing.',
  },
  BMI: {
    NORMAL: 'Your BMI is within a healthy range.',
    BORDERLINE: 'Your BMI is slightly above the healthy range. Regular exercise and balanced diet can help.',
    HIGH: 'Your BMI indicates you may benefit from speaking with a healthcare professional about weight management.',
  },
};

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async submitResults(dto: SubmitResultsDto) {
    const journey = await this.prisma.healthCheckJourney.findUnique({
      where: { id: dto.journey_id },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    validateTransition(journey.status, JourneyStatus.RESULTS_READY);

    // Save results
    await this.prisma.result.createMany({
      data: dto.results.map((r) => ({
        journey_id: dto.journey_id,
        metric: r.metric,
        value: r.value,
        unit: r.unit,
        status: r.status,
        pharmacist_id: dto.pharmacist_id,
        notes: dto.notes,
      })),
    });

    // Transition journey
    await this.prisma.healthCheckJourney.update({
      where: { id: dto.journey_id },
      data: { status: JourneyStatus.RESULTS_READY },
    });

    return { message: 'Results submitted successfully' };
  }

  async getResultsWithActions(journeyId: string) {
    const journey = await this.prisma.healthCheckJourney.findUnique({
      where: { id: journeyId },
      include: { results: true },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    const results = journey.results.map((r) => ({
      id: r.id,
      metric: r.metric,
      value: r.value,
      unit: r.unit,
      status: r.status,
      interpretation: this.getInterpretation(r.metric, r.status),
      recorded_at: r.recorded_at.toISOString(),
    }));

    const nextBestActions = this.generateNextBestActions(journey.results);

    return {
      journey_id: journeyId,
      results,
      next_best_actions: nextBestActions,
    };
  }

  private getInterpretation(metric: string, status: ResultStatus): string {
    return (
      METRIC_INTERPRETATIONS[metric]?.[status] ||
      `Your ${metric} result is ${status.toLowerCase()}.`
    );
  }

  private generateNextBestActions(
    results: { status: ResultStatus; metric: string }[],
  ): NextBestAction[] {
    const actions: NextBestAction[] = [];
    const hasHigh = results.some((r) => r.status === ResultStatus.HIGH);
    const hasBorderline = results.some(
      (r) => r.status === ResultStatus.BORDERLINE,
    );

    if (hasHigh) {
      actions.push({
        type: 'consultation',
        title: 'Book a GP Consultation',
        description:
          'Some of your results need attention. We recommend speaking with a GP.',
        cta_label: 'Find a GP',
        cta_url: '/consultation/gp',
        priority: 1,
      });
      actions.push({
        type: 'consultation',
        title: 'Speak to a Boots Pharmacist',
        description:
          'Our pharmacists can help you understand your results and next steps.',
        cta_label: 'Book Pharmacist Consultation',
        cta_url: '/consultation/pharmacist',
        priority: 2,
      });
    }

    if (hasBorderline) {
      actions.push({
        type: 'follow_up',
        title: 'Book a Follow-Up Health Check',
        description:
          'Monitor your progress with another check in 3-6 months.',
        cta_label: 'Book Follow-Up',
        cta_url: '/entry',
        priority: 3,
      });
      actions.push({
        type: 'product',
        title: 'Browse Heart Health Products',
        description:
          'Support your health with supplements and wellness products.',
        cta_label: 'Shop Now',
        cta_url: '/products/heart-health',
        priority: 4,
      });
    }

    if (!hasHigh && !hasBorderline) {
      actions.push({
        type: 'info',
        title: 'Maintain Your Health',
        description:
          'Great results! Keep up your healthy lifestyle. Consider regular check-ups.',
        cta_label: 'Health Tips',
        cta_url: '/tips/wellness',
        priority: 1,
      });
    }

    actions.push({
      type: 'product',
      title: 'Browse Wellness Products',
      description: 'Explore our range of health and wellness products.',
      cta_label: 'Browse Products',
      cta_url: '/products/wellness',
      priority: 5,
    });

    return actions.sort((a, b) => a.priority - b.priority);
  }
}
