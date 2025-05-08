import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/auth.guard';
import { ApplicationStatus } from '../entities/application-status.entity';
import { ApplicationStatusService } from '../services/application-status.service';
import { CreateApplicationStatusInput } from '../types/application-statuses/create-application-status.input';
import { UpdateApplicationStatusInput } from '../types/application-statuses/update-application-status.input';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permission } from '../../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';

@Resolver(() => ApplicationStatus)
@UseGuards(GqlAuthGuard, RbacGuard)
export class ApplicationStatusResolver {
  constructor(
    private readonly applicationStatusService: ApplicationStatusService
  ) {}

  @Query(() => [ApplicationStatus])
  @Permission(Resource.APPLICATION_STATUS, Action.VIEW)
  public async applicationStatuses(
    @Args() paginationArgs: PaginationArgs
  ): Promise<ApplicationStatus[]> {
    return this.applicationStatusService.findAll(paginationArgs);
  }

  @Query(() => ApplicationStatus)
  @Permission(Resource.APPLICATION_STATUS, Action.VIEW)
  public async applicationStatus(
    @Args('id') id: string
  ): Promise<ApplicationStatus> {
    const user = await this.applicationStatusService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @Mutation(() => ApplicationStatus)
  @Permission(Resource.APPLICATION_STATUS, Action.CREATE)
  public async createApplicationStatus(
    @Args('createApplicationStatusInput')
    createApplicationStatusInput: CreateApplicationStatusInput
  ): Promise<ApplicationStatus> {
    return await this.applicationStatusService.create(
      createApplicationStatusInput
    );
  }

  @Mutation(() => ApplicationStatus)
  @Permission(Resource.APPLICATION_STATUS, Action.UPDATE)
  public async updateApplicationStatus(
    @Args('id') id: string,
    @Args('updateApplicationStatusInput')
    updateApplicationStatusInput: UpdateApplicationStatusInput
  ): Promise<ApplicationStatus> {
    return await this.applicationStatusService.update(
      id,
      updateApplicationStatusInput
    );
  }

  @Mutation(() => ApplicationStatus)
  @Permission(Resource.APPLICATION_STATUS, Action.DELETE)
  public async removeApplicationStatus(@Args('id') id: string) {
    return this.applicationStatusService.remove(id);
  }
}
