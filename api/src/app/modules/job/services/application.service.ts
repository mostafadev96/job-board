/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Application } from '../entities/application.entity';
import { CreateApplicationInput } from '../types/applications/create-application.input';
import { UpdateApplicationInput } from '../types/applications/update-application.input copy';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ApplicationService {
  private currentUser = null;
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: Request
  ) {
    this.currentUser = (this.request as any).user;
  }

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: Prisma.applicationWhereInput
  ): Promise<Application[]> {
    const res = await  this.prismaService.application.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
      include: {
        job: true,
        seeker: true,
      }
    })
    return plainToInstance(Application, res);
  }

  public async findOneById(id: string): Promise<Application> {
    const entity = await this.prismaService.application.findFirst({
      where: { id },
      include: {
        job: true,
        seeker: true,
      }
    });

    if (!entity) {
      throw new UserInputError(`Application #${id} not found`);
    }
    return plainToInstance(Application, entity);
  }

  public async findByProp(data: Prisma.applicationWhereInput) {
    const entity = await this.prismaService.application.findFirst({
      where: data,
    });
    if (!entity) {
      throw new UserInputError(`Application not found`);
    }
    return plainToInstance(Application, entity);
  }

  public async create(
    createApplicationInput: CreateApplicationInput
  ): Promise<Application> {
    const seeker = await this.prismaService.seeker.findFirst({
      where: {
        id: this.currentUser.id,
      },
    });
    const job = await this.prismaService.job.findFirst({
      where: {
        id: createApplicationInput.jobId,
      },
    });
    if (!job) {
      throw new UserInputError(`Job #${createApplicationInput.jobId} not found`);
    }
    const entity = this.prismaService.application.create({
      data: {
        ...createApplicationInput,
        seekerEmail: seeker.email,
        seekerName: seeker.name,
        seekerPhone: seeker.phone,
        seekerId: seeker.id,
        jobTitle: job.title,
        jobContractType: job.contractType,
        jobId: job.id,
      },
    });
    return plainToInstance(Application, entity);
  }

  public async update(
    id: string,
    updateApplicationInput: UpdateApplicationInput
  ): Promise<Application> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Application #${id} not found`);
    }
    const {jobId, seekerId, ...otherProps} = updateApplicationInput;
    await this.prismaService.application.update({
      where: { id },
      data: {
        ...otherProps,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(Application, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Application #${id} not found`);
    }
    await this.prismaService.application.delete({
      where: { id },
    });
    return true;
  }
}
