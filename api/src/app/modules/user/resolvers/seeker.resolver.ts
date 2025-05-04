import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { SeekerService } from '../services/seeker.service';
import { Seeker } from '../entities/seeker.entity';
import { CreateSeekerInput } from '../types/seekers/create-seeker.input';
import { UpdateSeekerInput } from '../types/seekers/update-seeker.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/auth.guard';

@Resolver()
// @UseGuards(GqlAuthGuard)
export class SeekerResolver {
  constructor(private readonly usersService: SeekerService) {}

  @Query(() => [Seeker])
  public async seekers(@Args() paginationArgs: PaginationArgs): Promise<Seeker[]> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => Seeker)
  public async seeker(@Args('id') id: string): Promise<Seeker> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @Mutation(() => Seeker)
  public async createSeeker(
    @Args('createSeekerInput') createSeekerInput: CreateSeekerInput,
  ): Promise<Seeker> {
    return await this.usersService.create(createSeekerInput);
  }

  @Mutation(() => Seeker)
  public async updateSeeker(
    @Args('id') id: string,
    @Args('updateSeekerInput') updateSeekerInput: UpdateSeekerInput,
  ): Promise<Seeker> {
    return await this.usersService.update(id, updateSeekerInput);
  }

  @Mutation(() => Seeker)
  public async removeSeeker(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}