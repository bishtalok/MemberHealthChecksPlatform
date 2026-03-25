import { IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  journey_id!: string;

  @ApiProperty()
  @IsUUID()
  store_id!: string;

  @ApiProperty()
  @IsUUID()
  slot_id!: string;
}

export class SlotsQueryDto {
  @ApiProperty()
  @IsString()
  store_id!: string;

  @ApiProperty()
  @IsDateString()
  date!: string;
}
