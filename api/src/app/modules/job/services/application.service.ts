import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { Application } from '../entities/application.entity';
import { CreateApplicationInput } from '../types/applications/create-application.input';
import { UpdateApplicationInput } from '../types/applications/update-application.input copy';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: FindOptionsWhere<Application>
  ): Promise<Application[]> {
    const { limit, offset } = paginationArgs;
    return this.repo.find({
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
      ...(filters ? { where: filters } : {}),
    });
  }

  public async findOneById(id: string): Promise<Application> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new UserInputError(`Application #${id} not found`);
    }
    return user;
  }

  public async findByProp(data: FindOptionsWhere<Application>) {
    return this.repo.findOneBy(data);
  }

  public async create(
    createApplicationInput: CreateApplicationInput
  ): Promise<Application> {
    const user = this.repo.create({ ...createApplicationInput });
    return this.repo.save(user);
  }

  public async update(
    id: string,
    updateApplicationInput: UpdateApplicationInput
  ): Promise<Application> {
    const user = await this.repo.preload({
      id,
      ...updateApplicationInput,
    });

    if (!user) {
      throw new UserInputError(`Application #${id} not found`);
    }
    return this.repo.save(user);
  }

  public async remove(id: string) {
    const user = await this.findOneById(id);
    return this.repo.remove(user);
  }
}
