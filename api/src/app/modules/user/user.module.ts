import { Module } from '@nestjs/common';
import { RecruiterResolver } from './resolvers/recuiter.resolver';
import { RecruiterService } from './services/recruiter.service';
import { AdminService } from './services/admin.service';
import { SeekerService } from './services/seeker.service';
import { SeekerResolver } from './resolvers/seeker.resolver';
import { AdminResolver } from './resolvers/admin.resolver';
import { JobModule } from '../job/job.module';

@Module({
  imports: [
    JobModule
  ],
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
