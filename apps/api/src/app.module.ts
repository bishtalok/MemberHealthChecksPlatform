import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InsurerModule } from './insurer/insurer.module';
import { JourneyModule } from './journey/journey.module';
import { BookingModule } from './booking/booking.module';
import { ResultsModule } from './results/results.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    InsurerModule,
    JourneyModule,
    BookingModule,
    ResultsModule,
    DashboardModule,
    PharmacyModule,
  ],
})
export class AppModule {}
