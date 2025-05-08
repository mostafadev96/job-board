import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { ApplicationStatus } from '../entities/application-status.entity';
import { CreateApplicationStatusInput } from '../types/application-statuses/create-application-status.input';
import { UpdateApplicationStatusInput } from '../types/application-statuses/update-application-status.input';

@Injectable()
export class ApplicationStatusService {
  constructor(
    @InjectRepository(ApplicationStatus)
    private readonly repo: Repository<ApplicationStatus>
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: FindOptionsWhere<ApplicationStatus>
  ): Promise<ApplicationStatus[]> {
    const { limit, offset } = paginationArgs;
    return this.repo.find({
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
      ...(filters ? { where: filters } : {}),
    });
  }

  public async findOneById(id: string): Promise<ApplicationStatus> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new UserInputError(`ApplicationStatus #${id} not found`);
    }
    return user;
  }

  public async findByProp(data: FindOptionsWhere<ApplicationStatus>) {
    return this.repo.findOneBy(data);
  }

  public async create(
    createApplicationStatusInput: CreateApplicationStatusInput
  ): Promise<ApplicationStatus> {
    const user = this.repo.create({ ...createApplicationStatusInput });
    return this.repo.save(user);
  }

  public async update(
    id: string,
    updateApplicationStatusInput: UpdateApplicationStatusInput
  ): Promise<ApplicationStatus> {
    const user = await this.repo.preload({
      id,
      ...updateApplicationStatusInput,
    });

    if (!user) {
      throw new UserInputError(`ApplicationStatus #${id} not found`);
    }
    return this.repo.save(user);
  }

  public async remove(id: string) {
    const user = await this.findOneById(id);
    return this.repo.remove(user);
  }
}
