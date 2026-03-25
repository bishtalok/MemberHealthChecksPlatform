import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { ResultsService } from './results.service';
import { SubmitResultsDto } from './dto/results.dto';

@ApiTags('Results')
@Controller('api/results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @Roles('PHARMACIST', 'ADMIN')
  @ApiOperation({ summary: 'Submit health check results' })
  async submitResults(@Body() dto: SubmitResultsDto) {
    return this.resultsService.submitResults(dto);
  }

  @Get(':journeyId')
  @ApiOperation({ summary: 'Get results with next best actions' })
  async getResults(@Param('journeyId') journeyId: string) {
    return this.resultsService.getResultsWithActions(journeyId);
  }
}
