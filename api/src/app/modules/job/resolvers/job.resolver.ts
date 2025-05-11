import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/auth.guard';
import { Job } from '../entities/job.entity';
import { JobService } from '../services/job.service';
import { CreateJobInput } from '../types/jobs/create-job.input';
import { UpdateJobInput } from '../types/jobs/update-job.input';
import { Application } from '../entities/application.entity';
import { ApplicationService } from '../services/application.service';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permission } from '../../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';
import { User } from '../../user/entities/user.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JWTPayload } from '../../auth/types/jwt';

@Resolver(() => Job)
export class JobResolver {
  constructor(
    private readonly jobService: JobService,
    private readonly applicationService: ApplicationService
  ) {}

  @Query(() => [Job])
  public async jobs(@Args() paginationArgs: PaginationArgs): Promise<Job[]> {
    return this.jobService.findAll(paginationArgs);
  }

  @Query(() => Job)
  @UseGuards(GqlAuthGuard, RbacGuard)
  @Permission(Resource.JOB, Action.VIEW)
  public async job(@Args('id') id: string): Promise<Job> {
    const user = await this.jobService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @ResolveField()
  async applications(
    @Parent() job: Job
  ): Promise<Application[]> {
    return this.applicationService.findAll(
      { limit: 100, offset: 0 },
      { jobId: job.id }
    );
  }

  @Mutation(() => Job)
  @UseGuards(GqlAuthGuard, RbacGuard)
  @Permission(Resource.JOB, Action.CREATE)
  public async createJob(
    @Args('createJobInput') createJobInput: CreateJobInput,
    @CurrentUser() user: JWTPayload
  ): Promise<Job> {
    return await this.jobService.create(createJobInput, user);
  }

  @Mutation(() => Job)
  @UseGuards(GqlAuthGuard, RbacGuard)
  @Permission(Resource.JOB, Action.UPDATE)
  public async updateJob(
    @Args('updateJobInput') updateJobInput: UpdateJobInput
  ): Promise<Job> {
    return await this.jobService.update(updateJobInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RbacGuard)
  @Permission(Resource.JOB, Action.DELETE)
  public async removeJob(@Args('id') id: string) {
    return this.jobService.remove(id);
  }
}
