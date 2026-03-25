import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Roles('OPS', 'ADMIN')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  async getMetrics() {
    return this.dashboardService.getMetrics();
  }
}
