import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { RecruiterService } from '../services/recruiter.service';
import { Recruiter } from '../entities/recruiter.entity';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { CreateRecruiterInput } from '../types/recruiters/create-recruiter.input';
import { UpdateRecruiterInput } from '../types/recruiters/update-recruiter.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/auth.guard';
import { Job } from '../../job/entities/job.entity';
import { JobService } from '../../job/services/job.service';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permission } from '../../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';

@Resolver(() => Recruiter)
@UseGuards(GqlAuthGuard, RbacGuard)
export class RecruiterResolver {
  constructor(
    private readonly usersService: RecruiterService,
    private readonly jobService: JobService,
  ) {}

  @Query(() => [Recruiter])
  @Permission(Resource.RECRUITER, Action.VIEW)
  public async recruiters(
    @Args() paginationArgs: PaginationArgs
  ): Promise<Recruiter[]> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => Recruiter)
  @Permission(Resource.RECRUITER, Action.VIEW)
  public async recruiter(@Args('id') id: string): Promise<Recruiter> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @ResolveField()
  async publishedJobs(@Parent() recruiter: Recruiter): Promise<Job[]> {
    return this.jobService.findAll(
      { limit: 100, offset: 0 },
      { publisherId: recruiter.id }
    );
  }

  @Mutation(() => Recruiter)
  @Permission(Resource.RECRUITER, Action.CREATE)
  public async createRecruiter(
    @Args('createRecruiterInput') createRecruiterInput: CreateRecruiterInput
  ): Promise<Recruiter> {
    return await this.usersService.create(createRecruiterInput);
  }

  @Mutation(() => Recruiter)
  @Permission(Resource.RECRUITER, Action.UPDATE)
  public async updateRecruiter(
    @Args('id') id: string,
    @Args('updateRecruiterInput') updateRecruiterInput: UpdateRecruiterInput
  ): Promise<Recruiter> {
    return await this.usersService.update(id, updateRecruiterInput);
  }

  @Mutation(() => Recruiter)
  @Permission(Resource.RECRUITER, Action.DELETE)
  public async removeRecruiter(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}
