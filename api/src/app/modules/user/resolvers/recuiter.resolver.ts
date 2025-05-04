import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { RecruiterService } from '../services/recruiter.service';
import { Recruiter } from '../entities/recruiter.entity';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { CreateRecruiterInput } from '../types/recruiters/create-recruiter.input';
import { UpdateRecruiterInput } from '../types/recruiters/update-recruiter.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/auth.guard';

@Resolver()
// @UseGuards(GqlAuthGuard)
export class RecruiterResolver {
  constructor(private readonly usersService: RecruiterService) {}

  @Query(() => [Recruiter])
  public async recruiters(@Args() paginationArgs: PaginationArgs): Promise<Recruiter[]> {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => Recruiter)
  public async recruiter(@Args('id') id: string): Promise<Recruiter> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UserInputError(id);
    }
    return user;
  }

  @Mutation(() => Recruiter)
  public async createRecruiter(
    @Args('createRecruiterInput') createRecruiterInput: CreateRecruiterInput,
  ): Promise<Recruiter> {
    return await this.usersService.create(createRecruiterInput);
  }

  @Mutation(() => Recruiter)
  public async updateRecruiter(
    @Args('id') id: string,
    @Args('updateRecruiterInput') updateRecruiterInput: UpdateRecruiterInput,
  ): Promise<Recruiter> {
    return await this.usersService.update(id, updateRecruiterInput);
  }

  @Mutation(() => Recruiter)
  public async removeRecruiter(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}