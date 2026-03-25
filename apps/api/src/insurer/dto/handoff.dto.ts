import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandoffDto {
  @ApiProperty({ example: 'VTL-12345' })
  @IsString()
  insurer_member_id!: string;

  @ApiProperty({ example: 'vitality' })
  @IsString()
  insurer_code!: string;

  @ApiProperty({ example: 'mock-token-abc123' })
  @IsString()
  eligibility_token!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  callback_url?: string;
}
