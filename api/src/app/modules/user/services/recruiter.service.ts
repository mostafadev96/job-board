import { Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Recruiter } from '../entities/recruiter.entity';
import { CreateRecruiterInput } from '../types/recruiters/create-recruiter.input';
import { UpdateRecruiterInput } from '../types/recruiters/update-recruiter.input';
import * as bcrypt from 'bcrypt';
import { isStringHashed } from '../utils/hashs';

@Injectable()
export class RecruiterService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: Prisma.recruiterWhereInput
  ): Promise<Recruiter[]> {
    const res = await  this.prismaService.recruiter.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
      include: {
        hiring_company: true,
      }
    })
    return plainToInstance(Recruiter, res);
  }

  public async findOneById(id: string): Promise<Recruiter> {
    const entity = await this.prismaService.recruiter.findFirst({
      where: { id },
      include: {
        hiring_company: true,
      }
    });

    if (!entity) {
      throw new UserInputError(`Recruiter #${id} not found`);
    }
    return plainToInstance(Recruiter, entity);
  }

  public async findByProp(data: Prisma.recruiterWhereInput) {
    const entity = await this.prismaService.recruiter.findFirst({
      where: data,
    });
    if (!entity) {
      throw new UserInputError(`Recruiter not found`);
    }
    return plainToInstance(Recruiter, entity);
  }

  public async create(
    createRecruiterInput: CreateRecruiterInput
  ): Promise<Recruiter> {
    const entity = this.prismaService.recruiter.create({
      data: {
        ...createRecruiterInput,
        password: this.hashPasswordIfNotHashed(createRecruiterInput.password),
      },
    });
    return plainToInstance(Recruiter, entity);
  }

  public async update(
    id: string,
    updateRecruiterInput: UpdateRecruiterInput
  ): Promise<Recruiter> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Recruiter #${id} not found`);
    }
    if (updateRecruiterInput.password) {
      updateRecruiterInput.password = this.hashPasswordIfNotHashed(updateRecruiterInput.password);
    }
    await this.prismaService.recruiter.update({
      where: { id },
      data: {
        ...updateRecruiterInput,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(Recruiter, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Recruiter #${id} not found`);
    }
    await this.prismaService.recruiter.delete({
      where: { id },
    });
    return true;
  }

  private hashPasswordIfNotHashed(password: string) {
    let newPassword = password;
    if(!isStringHashed(password)) {
      const salt = bcrypt.genSaltSync();
      newPassword = bcrypt.hashSync(password, salt);
    }
    return newPassword;
  }
}
