import { Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { HiringCompany } from './entities/hiring-company.entity';
import { PaginationArgs } from '../../graphql/inputs/pagination-args.input';
import { CreateHiringCompanyInput } from './types/create-hiring-company.dto';
import { UpdateHiringCompanyInput } from './types/update-hiring-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HiringCompanyService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findAll(paginationArgs: PaginationArgs, filters?: Prisma.hiring_companyWhereInput): Promise<HiringCompany[]> 
  {
    const res = await  this.prismaService.hiring_company.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
      include: {
        job: true
      }
    })
    return plainToInstance(HiringCompany, res);
  }

  public async findOneById(id: string): Promise<HiringCompany> {
    const entity = await this.prismaService.hiring_company.findFirst({
        where: { id },
        include: {
          job: true
        }
    });

    if (!entity) {
      throw new UserInputError(`company #${id} not found`);
    }
    return plainToInstance(HiringCompany, entity);
  }

  public async create(createHiringCompanyInput: CreateHiringCompanyInput): Promise<HiringCompany> {
    const entity = await this.prismaService.hiring_company.create({
      data: {
        ...createHiringCompanyInput,
      },
    });
    return plainToInstance(HiringCompany, entity);
  }

  public async update(
    id: string,
    updateHiringCompanyInput: UpdateHiringCompanyInput,
  ): Promise<HiringCompany> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Company #${id} not found`);
    }
    await this.prismaService.hiring_company.update({
      where: { id },
      data: {
        ...updateHiringCompanyInput,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(HiringCompany, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Company #${id} not found`);
    }
    await this.prismaService.hiring_company.delete({
      where: { id },
    });
    return true;
  }
}