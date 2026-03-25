import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { MockUser } from '../auth/mock-users';
import { PharmacyService } from './pharmacy.service';

@ApiTags('Pharmacy')
@Controller('api/pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('daily-list')
  @Roles('PHARMACIST', 'ADMIN')
  @ApiOperation({ summary: 'Get daily health check list for a store' })
  async getDailyList(
    @CurrentUser() user: MockUser,
    @Query('store_id') storeId?: string,
    @Query('date') date?: string,
  ) {
    const effectiveStoreId = storeId || user.store_id;
    if (!effectiveStoreId) {
      return [];
    }
    return this.pharmacyService.getDailyList(effectiveStoreId, date);
  }
}
