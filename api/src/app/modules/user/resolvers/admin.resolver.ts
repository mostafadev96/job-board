import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { AdminService } from '../services/admin.service';
import { Admin } from '../entities/admin.entity';
import { CreateAdminInput } from '../types/admins/create-admin.input';
import { UpdateAdminInput } from '../types/admins/update-admin.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permission } from '../../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';

@Resolver(() => Admin)
@UseGuards(GqlAuthGuard, RbacGuard)
export class AdminResolver {
  constructor(private readonly usersService: AdminService) {}

  @Query(() => [Admin])
  @Permission(Resource.ADMIN, Action.VIEW)
  public async admins(@Args() paginationArgs: PaginationArgs): Promise<Admin[]> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => Admin)
  @Permission(Resource.ADMIN, Action.VIEW)
  public async admin(@Args('id') id: string): Promise<Admin> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @Mutation(() => Admin)
  @Permission(Resource.ADMIN, Action.CREATE)
  public async createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput,
  ): Promise<Admin> {
    return await this.usersService.create(createAdminInput);
  }

  @Mutation(() => Admin)
  @Permission(Resource.ADMIN, Action.UPDATE)
  public async updateAdmin(
    @Args('updateAdminInput') updateAdminInput: UpdateAdminInput,
  ): Promise<Admin> {
    return await this.usersService.update(updateAdminInput);
  }

  @Mutation(() => Boolean)
  @Permission(Resource.ADMIN, Action.DELETE)
  public async removeAdmin(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}