import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserInputError } from '@nestjs/apollo';
import { HiringCompanyService } from './hiring-company.service';
import { HiringCompany } from './entities/hiring-company.entity';
import { PaginationArgs } from '../../graphql/inputs/pagination-args.input';
import { CreateHiringCompanyInput } from './types/create-hiring-company.dto';
import { UpdateHiringCompanyInput } from './types/update-hiring-company.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/auth.guard';
import { Recruiter } from '../user/entities/recruiter.entity';
import { RecruiterService } from '../user/services/recruiter.service';
import { Job } from '../job/entities/job.entity';
import { JobService } from '../job/services/job.service';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import { Action, Resource } from '@job-board/rbac';

@Resolver(() => HiringCompany)
@UseGuards(GqlAuthGuard, RbacGuard)
export class HiringCompanyResolver {
  constructor(
    private readonly service: HiringCompanyService,
    private readonly recService: RecruiterService,
    private readonly jobService: JobService
  ) {}

  @Query(() => [HiringCompany])
  @Permission(Resource.HIRING_COMPANY, Action.VIEW)
  public async hiringCompanies(
    @Args() paginationArgs: PaginationArgs
  ): Promise<HiringCompany[]> {
    return this.service.findAll(paginationArgs);
  }

  @Query(() => HiringCompany)
  @Permission(Resource.HIRING_COMPANY, Action.VIEW)
  public async hiringCompany(@Args('id') id: string): Promise<HiringCompany> {
    const companyEntity = await this.service.findOneById(id);
    if (!companyEntity) {
      throw new UserInputError(id);
    }
    return companyEntity;
  }

  @ResolveField()
  async recruiters(
    @Parent() hiringCompany: HiringCompany
  ): Promise<Recruiter[]> {
    return this.recService.findAll(
      { limit: 100, offset: 0 },
      { companyId: hiringCompany.id }
    );
  }

  @ResolveField()
  async jobs(@Parent() hiringCompany: HiringCompany): Promise<Job[]> {
    return this.jobService.findAll(
      { limit: 100, offset: 0 },
      { companyId: hiringCompany.id }
    );
  }

  @Mutation(() => HiringCompany)
  @Permission(Resource.HIRING_COMPANY, Action.CREATE)
  public async createHiringCompany(
    @Args('createHiringCompanyInput')
    createHiringCompanyInput: CreateHiringCompanyInput
  ): Promise<HiringCompany> {
    return await this.service.create(createHiringCompanyInput);
  }

  @Mutation(() => HiringCompany)
  @Permission(Resource.HIRING_COMPANY, Action.UPDATE)
  public async updateHiringCompany(
    @Args('updateHiringCompanyInput')
    updateHiringCompanyInput: UpdateHiringCompanyInput
  ): Promise<HiringCompany> {
    return await this.service.update(updateHiringCompanyInput);
  }

  @Mutation(() => Boolean)
  @Permission(Resource.HIRING_COMPANY, Action.DELETE)
  public async removeHiringCompany(@Args('id') id: string) {
    return this.service.remove(id);
  }
}
