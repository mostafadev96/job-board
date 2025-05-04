import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Job } from './entities/job.entity';
import { JobResolver } from './job.resolver';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Job])],
  providers: [
    // JobService,
    // JobResolver
  ],
})
export class JobModule {}
