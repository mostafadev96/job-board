import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HiringCompany } from './entities/hiring-company.entity';
import { HiringCompanyResolver } from './hiring-company.resolver';
import { HiringCompanyService } from './hiring-company.service';
import { UserModule } from '../user/user.module';
import { RecruiterService } from '../user/services/recruiter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HiringCompany
    ]),
    UserModule
  ],
  providers: [
    HiringCompanyResolver,
    HiringCompanyService
  ],
})
export class HiringCompanyModule {}
