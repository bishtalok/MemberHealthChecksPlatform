import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JourneyStatus, BookingStatus } from '@prisma/client';
import { validateTransition } from '../journey/journey-state-machine';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(storeId: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const slots = await this.prisma.slot.findMany({
      where: {
        store_id: storeId,
        start_time: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { start_time: 'asc' },
    });

    return slots.map((slot) => ({
      id: slot.id,
      start_time: slot.start_time.toISOString(),
      end_time: slot.end_time.toISOString(),
      available: slot.booked < slot.capacity,
    }));
  }

  async getStores() {
    return this.prisma.store.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createBooking(journeyId: string, storeId: string, slotId: string) {
    // Validate journey status
    const journey = await this.prisma.healthCheckJourney.findUnique({
      where: { id: journeyId },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    validateTransition(journey.status, JourneyStatus.BOOKED);

    // Atomic: check capacity and book in a transaction
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({ where: { id: slotId } });

      if (!slot) {
        throw new NotFoundException('Slot not found');
      }

      if (slot.booked >= slot.capacity) {
        throw new ConflictException('Slot is fully booked');
      }

      // Check for existing booking on this journey
      const existingBooking = await tx.booking.findUnique({
        where: { journey_id: journeyId },
      });

      if (existingBooking) {
        throw new BadRequestException('Journey already has a booking');
      }

      // Increment booked count
      await tx.slot.update({
        where: { id: slotId },
        data: { booked: { increment: 1 } },
      });

      // Create booking
      const booking = await tx.booking.create({
        data: {
          journey_id: journeyId,
          store_id: storeId,
          slot_id: slotId,
          status: BookingStatus.CONFIRMED,
        },
        include: { store: true, slot: true },
      });

      // Update journey status
      await tx.healthCheckJourney.update({
        where: { id: journeyId },
        data: { status: JourneyStatus.BOOKED },
      });

      return {
        id: booking.id,
        journey_id: booking.journey_id,
        store_id: booking.store_id,
        store_name: booking.store.name,
        slot_start: booking.slot.start_time.toISOString(),
        slot_end: booking.slot.end_time.toISOString(),
        status: booking.status,
        confirmed_at: booking.confirmed_at.toISOString(),
      };
    });
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Decrement slot booked count
      await tx.slot.update({
        where: { id: booking.slot_id },
        data: { booked: { decrement: 1 } },
      });

      // Cancel booking
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      // Revert journey status
      await tx.healthCheckJourney.update({
        where: { id: booking.journey_id },
        data: { status: JourneyStatus.PRE_ASSESSMENT_COMPLETE },
      });

      return { message: 'Booking cancelled' };
    });
  }
}
