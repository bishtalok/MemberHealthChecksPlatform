import { IsString, IsUUID, IsArray, IsNumber, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResultStatus } from '@prisma/client';

export class HealthCheckResultDto {
  @ApiProperty({ example: 'Systolic Blood Pressure' })
  @IsString()
  metric!: string;

  @ApiProperty({ example: 128 })
  @IsNumber()
  value!: number;

  @ApiProperty({ example: 'mmHg' })
  @IsString()
  unit!: string;

  @ApiProperty({ enum: ResultStatus })
  @IsEnum(ResultStatus)
  status!: ResultStatus;
}

export class SubmitResultsDto {
  @ApiProperty()
  @IsUUID()
  journey_id!: string;

  @ApiProperty()
  @IsString()
  pharmacist_id!: string;

  @ApiProperty({ type: [HealthCheckResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HealthCheckResultDto)
  results!: HealthCheckResultDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
