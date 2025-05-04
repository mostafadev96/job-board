import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { HiringCompanyService } from './hiring-company.service';
import { HiringCompany } from './entities/hiring-company.entity';
import { PaginationArgs } from '../../graphql/inputs/pagination-args.input';
import { CreateHiringCompanyInput } from './types/create-hiring-company.dto';
import { UpdateHiringCompanyInput } from './types/update-hiring-company.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { Recruiter } from '../user/entities/recruiter.entity';
import { RecruiterService } from '../user/services/recruiter.service';

@Resolver(() => HiringCompany)
@UseGuards(GqlAuthGuard)
export class HiringCompanyResolver {
  constructor(
    private readonly service: HiringCompanyService,
    private readonly recService: RecruiterService
  ) {}

  @Query(() => [HiringCompany])
  public async hiringCompanies(@Args() paginationArgs: PaginationArgs): Promise<HiringCompany[]> {
    return this.service.findAll(paginationArgs);
  }

  @Query(() => HiringCompany)
  public async hiringCompany(@Args('id') id: string): Promise<HiringCompany> {
    const companyEntity = await this.service.findOneById(id);
    if (!companyEntity) {
      throw new UserInputError(id);
    }
    return companyEntity;
  }

  @ResolveField()
  async recruiters(@Parent() hiringCompany: HiringCompany): Promise<Recruiter[]> {
    return this.recService.findAll({ limit: 100, offset: 0 }, { companyId: hiringCompany.id });
  }

  @Mutation(() => HiringCompany)
  public async createHiringCompany(
    @Args('createHiringCompanyInput') createHiringCompanyInput: CreateHiringCompanyInput,
  ): Promise<HiringCompany> {
    return await this.service.create(createHiringCompanyInput);
  }

  @Mutation(() => HiringCompany)
  public async updateHiringCompany(
    @Args('id') id: string,
    @Args('updateHiringCompanyInput') updateHiringCompanyInput: UpdateHiringCompanyInput,
  ): Promise<HiringCompany> {
    return await this.service.update(id, updateHiringCompanyInput);
  }

  @Mutation(() => Boolean)
  public async removeHiringCompany(@Args('id') id: string) {
    return this.service.remove(id);
  }
}