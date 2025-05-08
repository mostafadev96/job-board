import { Inject, Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { ApplicationStatus } from '../entities/application-status.entity';
import { CreateApplicationStatusInput } from '../types/application-statuses/create-application-status.input';
import { UpdateApplicationStatusInput } from '../types/application-statuses/update-application-status.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ApplicationStatusService {
  private currentUser = null;
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: Request
  ) {
    this.currentUser = (this.request as any).user;
  }

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: Prisma.application_statusWhereInput
  ): Promise<ApplicationStatus[]> {
    const res = await  this.prismaService.application_status.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
      include: {
        application: true,
        recruiter: true,
      }
    })
    return plainToInstance(ApplicationStatus, res);
  }

  public async findOneById(id: string): Promise<ApplicationStatus> {
    const entity = await this.prismaService.application_status.findFirst({
      where: { id },
      include: {
        application: true,
        recruiter: true,
      }
    });

    if (!entity) {
      throw new UserInputError(`ApplicationStatus #${id} not found`);
    }
    return plainToInstance(ApplicationStatus, entity);
  }

  public async findByProp(data: Prisma.application_statusWhereInput) {
    const entity = await this.prismaService.application_status.findFirst({
      where: data,
    });
    if (!entity) {
      throw new UserInputError(`ApplicationStatus not found`);
    }
    return plainToInstance(ApplicationStatus, entity);
  }

  public async create(
    createApplicationStatusInput: CreateApplicationStatusInput
  ): Promise<ApplicationStatus> {
    const recruiter = await this.prismaService.recruiter.findFirst({
      where: {
        id: this.currentUser.id,
      },
    });
    const user = await this.prismaService.application_status.create({
      data: {
        ...createApplicationStatusInput,
        recruiterId: recruiter.id,
        recruiterName: recruiter.name,
      },
    });
    return plainToInstance(ApplicationStatus, user);
  }

  public async update(
    id: string,
    updateApplicationStatusInput: UpdateApplicationStatusInput
  ): Promise<ApplicationStatus> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`ApplicationStatus #${id} not found`);
    }
    await this.prismaService.application_status.update({
      where: { id },
      data: {
        ...updateApplicationStatusInput,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(ApplicationStatus, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`ApplicationStatus #${id} not found`);
    }
    await this.prismaService.hiring_company.delete({
      where: { id },
    });
    return true;
  }
}
