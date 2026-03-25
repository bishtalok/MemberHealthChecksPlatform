import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';

@ApiTags('Booking')
@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('stores')
  @ApiOperation({ summary: 'List available stores' })
  async getStores() {
    return this.bookingService.getStores();
  }

  @Get('slots')
  @ApiOperation({ summary: 'Get available slots for a store on a date' })
  async getSlots(
    @Query('store_id') storeId: string,
    @Query('date') date: string,
  ) {
    return this.bookingService.getAvailableSlots(storeId, date);
  }

  @Post()
  @ApiOperation({ summary: 'Create a booking' })
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(
      dto.journey_id,
      dto.store_id,
      dto.slot_id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  async cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancelBooking(id);
  }
}
