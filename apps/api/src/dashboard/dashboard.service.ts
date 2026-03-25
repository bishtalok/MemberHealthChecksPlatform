import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JourneyStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const totalJourneys = await this.prisma.healthCheckJourney.count();
    const completedJourneys = await this.prisma.healthCheckJourney.count({
      where: { status: JourneyStatus.COMPLETED },
    });

    const journeysByStatus = await this.prisma.healthCheckJourney.groupBy({
      by: ['status'],
      _count: true,
    });

    const journeysByType = await this.prisma.healthCheckJourney.groupBy({
      by: ['journey_type'],
      _count: true,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsToday = await this.prisma.booking.count({
      where: {
        slot: {
          start_time: { gte: today, lt: tomorrow },
        },
        status: 'CONFIRMED',
      },
    });

    const statusMap: Record<string, number> = {};
    journeysByStatus.forEach((item) => {
      statusMap[item.status] = item._count;
    });

    const typeMap: Record<string, number> = {};
    journeysByType.forEach((item) => {
      typeMap[item.journey_type] = item._count;
    });

    return {
      total_journeys: totalJourneys,
      completed_journeys: completedJourneys,
      completion_rate:
        totalJourneys > 0
          ? Math.round((completedJourneys / totalJourneys) * 100)
          : 0,
      journeys_by_status: statusMap,
      journeys_by_type: typeMap,
      bookings_today: bookingsToday,
    };
  }
}
