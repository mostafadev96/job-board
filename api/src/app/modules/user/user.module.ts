import { Module } from '@nestjs/common';
import { RecruiterResolver } from './resolvers/recuiter.resolver';
import { RecruiterService } from './services/recruiter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Recruiter } from './entities/recruiter.entity';
import { Seeker } from './entities/seeker.entity';
import { AdminService } from './services/admin.service';
import { SeekerService } from './services/seeker.service';
import { SeekerResolver } from './resolvers/seeker.resolver';
import { AdminResolver } from './resolvers/admin.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Recruiter, Seeker])],
  providers: [
    RecruiterService,
    AdminService,
    SeekerService,
    RecruiterResolver,
    AdminResolver,
    SeekerResolver,
  ],
  exports: [
    RecruiterService,
    AdminService,
    SeekerService,
  ]
})
export class UserModule {}
