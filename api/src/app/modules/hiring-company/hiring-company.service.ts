import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { HiringCompany } from './entities/hiring-company.entity';
import { PaginationArgs } from '../../graphql/inputs/pagination-args.input';
import { CreateHiringCompanyInput } from './types/create-hiring-company.dto';
import { UpdateHiringCompanyInput } from './types/update-hiring-company.dto';

@Injectable()
export class HiringCompanyService {
  constructor(
    @InjectRepository(HiringCompany)
    private readonly repository: Repository<HiringCompany>,
  ) {}

  public async findAll(paginationArgs: PaginationArgs): Promise<HiringCompany[]> 
  {
    const { limit, offset } = paginationArgs;
    return this.repository.find({
      skip: offset,
      take: limit,
    });
  }

  public async findOneById(id: string): Promise<HiringCompany> {
    const entity = await this.repository.findOne({
        where: { id },
    });

    if (!entity) {
      throw new UserInputError(`company #${id} not found`);
    }
    return entity;
  }

  public async create(createUserInput: CreateHiringCompanyInput): Promise<HiringCompany> {
    const entity = this.repository.create({ ...createUserInput});
    return this.repository.save(entity);
  }

  public async update(
    id: string,
    updateUserInput: UpdateHiringCompanyInput,
  ): Promise<HiringCompany> {

    const user = await this.repository.preload({
      id,
      ...updateUserInput,
    });

    if (!user) {
      throw new UserInputError(`Company #${id} not found`);
    }
    return this.repository.save(user);
  }

  public async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new UserInputError(`Company #${id} not found`);
    }
    await this.repository.remove(user);
    return true;
  }
}