import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HiringCompany } from './entities/hiring-company.entity';
import { HiringCompanyResolver } from './hiring-company.resolver';
import { HiringCompanyService } from './hiring-company.service';
import { UserModule } from '../user/user.module';
import { JobModule } from '../job/job.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HiringCompany
    ]),
    UserModule,
    JobModule
  ],
  providers: [
    HiringCompanyResolver,
    HiringCompanyService
  ],
})
export class HiringCompanyModule {}
