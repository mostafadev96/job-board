import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { AdminService } from '../services/admin.service';
import { Admin } from '../entities/admin.entity';
import { CreateAdminInput } from '../types/admins/create-admin.input';
import { UpdateAdminInput } from '../types/admins/update-admin.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AdminResolver {
  constructor(private readonly usersService: AdminService) {}

  @Query(() => [Admin])
  public async admins(@Args() paginationArgs: PaginationArgs): Promise<Admin[]> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => Admin)
  public async admin(@Args('id') id: string): Promise<Admin> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @Mutation(() => Admin)
  public async createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput,
  ): Promise<Admin> {
    return await this.usersService.create(createAdminInput);
  }

  @Mutation(() => Admin)
  public async updateAdmin(
    @Args('id') id: string,
    @Args('updateAdminInput') updateAdminInput: UpdateAdminInput,
  ): Promise<Admin> {
    return await this.usersService.update(id, updateAdminInput);
  }

  @Mutation(() => Admin)
  public async removeAdmin(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}