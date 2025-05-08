import { Inject, Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Job } from '../entities/job.entity';
import { CreateJobInput } from '../types/jobs/create-job.input';
import { REQUEST } from '@nestjs/core';
import { UpdateJobInput } from '../types/jobs/update-job.input';

@Injectable()
export class JobService {
  private currentUser = null;
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: Request
  ) {
    this.currentUser = (this.request as any).user;
  }

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: Prisma.jobWhereInput
  ): Promise<Job[]> {
    const res = await  this.prismaService.job.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
      include: {
        hiring_company: true,
        recruiter: true,
      }
    })
    return plainToInstance(Job, res);
  }

  public async findOneById(id: string): Promise<Job> {
    const entity = await this.prismaService.job.findFirst({
      where: { id },
    });

    if (!entity) {
      throw new UserInputError(`Job #${id} not found`);
    }
    return plainToInstance(Job, entity);
  }

  public async findByProp(data: Prisma.jobWhereInput) {
    const entity = await this.prismaService.job.findFirst({
      where: data,
    });
    if (!entity) {
      throw new UserInputError(`Application not found`);
    }
    return plainToInstance(Job, entity);
  }

  public async create(
    createJobInput: CreateJobInput
  ): Promise<Job> {
    const recruiter = await this.prismaService.recruiter.findFirst({
      where: {
        id: this.currentUser.id,
      },
    });
    const entity = this.prismaService.job.create({
      data: {
        ...createJobInput,
        publisherId: recruiter.id,
        companyId: recruiter.companyId,
      },
    });
    return plainToInstance(Job, entity);
  }

  public async update(
    id: string,
    updateJobInput: UpdateJobInput
  ): Promise<Job> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Job #${id} not found`);
    }
    await this.prismaService.job.update({
      where: { id },
      data: {
        ...updateJobInput,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(Job, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Job #${id} not found`);
    }
    await this.prismaService.application.delete({
      where: { id },
    });
    return true;
  }
}
