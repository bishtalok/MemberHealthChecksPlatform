import { Module } from '@nestjs/common';
import { InsurerController } from './insurer.controller';
import { InsurerService } from './insurer.service';

@Module({
  controllers: [InsurerController],
  providers: [InsurerService],
})
export class InsurerModule {}
