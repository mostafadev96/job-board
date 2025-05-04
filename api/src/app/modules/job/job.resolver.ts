import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';
import { CreateJobInput } from './types/create-job.input';
import { UpdateJobInput } from './types/update-job.input';

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobsService: JobService) {}

  @Query(() => [Job])
  getAllJobs() {
    return this.jobsService.getAllJobs();
  }

  @Query(() => Job, { nullable: true })
  getJobById(@Args('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Query(() => [Job])
  getJobByText(@Args('text') text: string) {
    return this.jobsService.getJobByProperty({
        title: text,
    });
  }

  @Query(() => [Job])
  getJobByCompany(@Args('company') company: string) {
    return this.jobsService.getJobByProperty({
        companyId: company,
    });
  }

  @Mutation(() => Job)
  createJob(@Args('input') input: CreateJobInput) {
    return this.jobsService.createJob(input);
  }

  @Mutation(() => Job, { nullable: true })
  updateJob(@Args('input') input: UpdateJobInput) {
    return this.jobsService.updateJob(input);
  }

  @Mutation(() => Boolean)
  deleteJob(@Args('id') id: string) {
    return this.jobsService.deleteJob(id);
  }
}
