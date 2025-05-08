import { Module } from '@nestjs/common';
import { HiringCompanyResolver } from './hiring-company.resolver';
import { HiringCompanyService } from './hiring-company.service';
import { UserModule } from '../user/user.module';
import { JobModule } from '../job/job.module';

@Module({
  imports: [
    UserModule,
    JobModule
  ],
  providers: [
    HiringCompanyResolver,
    HiringCompanyService
  ],
})
export class HiringCompanyModule {}
