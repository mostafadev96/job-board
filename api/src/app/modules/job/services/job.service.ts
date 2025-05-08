import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { Job } from '../entities/job.entity';
import { CreateJobInput } from '../types/jobs/create-job.input';
import { UpdateJobInput } from '../types/jobs/update-job.input';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly repo: Repository<Job>
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: FindOptionsWhere<Job>
  ): Promise<Job[]> {
    const { limit, offset } = paginationArgs;
    return this.repo.find({
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
      ...(filters ? { where: filters } : {}),
    });
  }

  public async findOneById(id: string): Promise<Job> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new UserInputError(`Job #${id} not found`);
    }
    return user;
  }

  public async findByProp(data: FindOptionsWhere<Job>) {
    return this.repo.findOneBy(data);
  }

  public async create(createJobInput: CreateJobInput): Promise<Job> {
    const user = this.repo.create({ ...createJobInput });
    return this.repo.save(user);
  }

  public async update(
    id: string,
    updateJobInput: UpdateJobInput
  ): Promise<Job> {
    const user = await this.repo.preload({
      id,
      ...updateJobInput,
    });

    if (!user) {
      throw new UserInputError(`Job #${id} not found`);
    }
    return this.repo.save(user);
  }

  public async remove(id: string) {
    const user = await this.findOneById(id);
    return this.repo.remove(user);
  }
}
