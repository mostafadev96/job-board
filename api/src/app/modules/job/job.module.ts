import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Job } from './entities/job.entity';
import { JobResolver } from './resolvers/job.resolver';
import { JobService } from './services/job.service';
import { ApplicationService } from './services/application.service';
import { ApplicationResolver } from './resolvers/application.resolver';
import { ApplicationStatus } from './entities/application-status.entity';
import { ApplicationStatusService } from './services/application-status.service';
import { ApplicationStatusResolver } from './resolvers/application-status.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application, ApplicationStatus])],
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
