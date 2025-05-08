import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { SeekerService } from '../services/seeker.service';
import { Seeker } from '../entities/seeker.entity';
import { CreateSeekerInput } from '../types/seekers/create-seeker.input';
import { UpdateSeekerInput } from '../types/seekers/update-seeker.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/auth.guard';
import { Application } from '../../job/entities/application.entity';
import { ApplicationService } from '../../job/services/application.service';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permission } from '../../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';

@Resolver(() => Seeker)
@UseGuards(GqlAuthGuard, RbacGuard)
export class SeekerResolver {
  constructor(
    private readonly usersService: SeekerService,
    private readonly applicationService: ApplicationService
  ) {}

  @Query(() => [Seeker])
  @Permission(Resource.SEEKER, Action.VIEW)
  public async seekers(
    @Args() paginationArgs: PaginationArgs
  ): Promise<Seeker[]> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => Seeker)
  @Permission(Resource.SEEKER, Action.VIEW)
  public async seeker(@Args('id') id: string): Promise<Seeker> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @ResolveField()
  async applications(@Parent() seeker: Seeker): Promise<Application[]> {
    return this.applicationService.findAll(
      { limit: 100, offset: 0 },
      { seekerId: seeker.id }
    );
  }

  @Mutation(() => Seeker)
  @Permission(Resource.SEEKER, Action.CREATE)
  public async createSeeker(
    @Args('createSeekerInput') createSeekerInput: CreateSeekerInput
  ): Promise<Seeker> {
    return await this.usersService.create(createSeekerInput);
  }

  @Mutation(() => Seeker)
  @Permission(Resource.SEEKER, Action.UPDATE)
  public async updateSeeker(
    @Args('id') id: string,
    @Args('updateSeekerInput') updateSeekerInput: UpdateSeekerInput
  ): Promise<Seeker> {
    return await this.usersService.update(id, updateSeekerInput);
  }

  @Mutation(() => Seeker)
  @Permission(Resource.SEEKER, Action.DELETE)
  public async removeSeeker(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}
