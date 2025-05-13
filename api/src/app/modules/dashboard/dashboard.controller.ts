import { Controller, Get, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(GqlAuthGuard)
export class DashboardController {
  constructor(private readonly authService: DashboardService) {}

  @Get('summary')
  dashboardSummary() {
    return this.authService.getSummary();
  }
}
