import { Module } from '@nestjs/common';
import { JobResolver } from './resolvers/job.resolver';
import { JobService } from './services/job.service';
import { ApplicationService } from './services/application.service';
import { ApplicationResolver } from './resolvers/application.resolver';
import { ApplicationStatusService } from './services/application-status.service';
import { ApplicationStatusResolver } from './resolvers/application-status.resolver';

@Module({
  imports: [],
  providers: [
    JobService,
    ApplicationService,
    ApplicationStatusService,
    JobResolver,
    ApplicationResolver,
    ApplicationStatusResolver
  ],
  exports: [
    JobService,
    ApplicationService,
    ApplicationStatusService,
  ],
})
export class JobModule {}
