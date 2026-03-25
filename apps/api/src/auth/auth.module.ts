import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MockAuthGuard } from './mock-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: MockAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
