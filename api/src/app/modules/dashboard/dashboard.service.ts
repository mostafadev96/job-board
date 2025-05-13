import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async getSummary() {
    const jobCount = await this.prismaService.job.count();
    const applicationCount = await this.prismaService.application.count();
    const companyCount = await this.prismaService.hiring_company.count();
    const seekerCount = await this.prismaService.seeker.count();
    return {
      jobs: jobCount,
      applications: applicationCount,
      companies: companyCount,
      seekers: seekerCount,
    };
  }
}
