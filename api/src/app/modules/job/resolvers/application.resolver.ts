import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/auth.guard';
import { Application } from '../entities/application.entity';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationInput } from '../types/applications/create-application.input';
import { UpdateApplicationInput } from '../types/applications/update-application.input copy';
import { ApplicationStatusService } from '../services/application-status.service';
import { ApplicationStatus } from '../entities/application-status.entity';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permission } from '../../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JWTPayload } from '../../auth/types/jwt';

@Resolver(() => Application)
@UseGuards(GqlAuthGuard, RbacGuard)
export class ApplicationResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationStatusService: ApplicationStatusService
  ) {}

  @Query(() => [Application])
  @Permission(Resource.APPLICATION, Action.VIEW)
  public async applications(
    @Args() paginationArgs: PaginationArgs
  ): Promise<Application[]> {
    return this.applicationService.findAll(paginationArgs);
  }

  @Query(() => Application)
  @Permission(Resource.APPLICATION, Action.VIEW)
  public async application(@Args('id') id: string): Promise<Application> {
    const user = await this.applicationService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @ResolveField()
  async applicationStatuses(@Parent() application: Application): Promise<ApplicationStatus[]> {
    return this.applicationStatusService.findAll(
      { limit: 100, offset: 0 },
      { applicationId: application.id }
    );
  }

  @Mutation(() => Application)
  @Permission(Resource.APPLICATION, Action.APPLY)
  public async createApplication(
    @Args('createApplicationInput')
    createApplicationInput: CreateApplicationInput,
    @CurrentUser() user: JWTPayload
    
  ): Promise<Application> {
    return await this.applicationService.create(createApplicationInput, user);
  }

  @Mutation(() => Application)
  @Permission(Resource.APPLICATION, Action.UPDATE)
  public async updateApplication(
    @Args('updateApplicationInput')
    updateApplicationInput: UpdateApplicationInput,
    @CurrentUser() user: JWTPayload

  ): Promise<Application> {
    return await this.applicationService.update(updateApplicationInput, user);
  }

  @Mutation(() => Boolean)
  @Permission(Resource.APPLICATION, Action.DELETE)
  public async removeApplication(@Args('id') id: string) {
    return this.applicationService.remove(id);
  }
}
