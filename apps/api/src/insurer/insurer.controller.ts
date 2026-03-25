import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InsurerService } from './insurer.service';
import { HandoffDto } from './dto/handoff.dto';

@ApiTags('Insurer')
@Controller('api/insurer')
export class InsurerController {
  constructor(private readonly insurerService: InsurerService) {}

  @Post('handoff')
  @ApiOperation({ summary: 'Handle insurer member handoff' })
  async handoff(@Body() dto: HandoffDto) {
    return this.insurerService.handleHandoff(dto);
  }
}
