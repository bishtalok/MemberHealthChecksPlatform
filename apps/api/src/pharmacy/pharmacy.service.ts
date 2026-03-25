import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class PharmacyService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyList(storeId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await this.prisma.booking.findMany({
      where: {
        store_id: storeId,
        slot: {
          start_time: { gte: targetDate, lt: nextDay },
        },
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
      include: {
        slot: true,
        journey: {
          include: {
            member: {
              select: {
                first_name: true,
                last_name: true,
                insurer_member_id: true,
              },
            },
          },
        },
      },
      orderBy: {
        slot: { start_time: 'asc' },
      },
    });

    return bookings.map((b) => ({
      booking_id: b.id,
      slot_start: b.slot.start_time.toISOString(),
      slot_end: b.slot.end_time.toISOString(),
      member_name: `${b.journey.member.first_name || ''} ${b.journey.member.last_name || ''}`.trim() || b.journey.member.insurer_member_id,
      journey_type: b.journey.journey_type,
      journey_status: b.journey.status,
      journey_id: b.journey.id,
      booking_status: b.status,
    }));
  }
}
