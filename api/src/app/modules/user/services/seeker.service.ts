import { Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Seeker } from '../entities/seeker.entity';
import { CreateSeekerInput } from '../types/seekers/create-seeker.input';
import { UpdateSeekerInput } from '../types/seekers/update-seeker.input';
import * as bcrypt from 'bcrypt';
import { isStringHashed } from '../utils/hashs';

@Injectable()
export class SeekerService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: Prisma.seekerWhereInput
  ): Promise<Seeker[]> {
    const res = await  this.prismaService.seeker.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
    })
    return plainToInstance(Seeker, res);
  }

  public async findOneById(id: string): Promise<Seeker> {
    const entity = await this.prismaService.seeker.findFirst({
      where: { id },
    });

    if (!entity) {
      throw new UserInputError(`Seeker #${id} not found`);
    }
    return plainToInstance(Seeker, entity);
  }

  public async findByProp(data: Prisma.seekerWhereInput) {
    const entity = await this.prismaService.seeker.findFirst({
      where: data,
    });
    if (!entity) {
      throw new UserInputError(`Seeker not found`);
    }
    return plainToInstance(Seeker, entity);
  }

  public async create(
    createSeekerInput: CreateSeekerInput
  ): Promise<Seeker> {
    const entity = this.prismaService.seeker.create({
      data: {
        ...createSeekerInput,
        password: this.hashPasswordIfNotHashed(createSeekerInput.password),
      },
    });
    return plainToInstance(Seeker, entity);
  }

  public async update(
    id: string,
    updateSeekerInput: UpdateSeekerInput
  ): Promise<Seeker> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Seeker #${id} not found`);
    }
    if (updateSeekerInput.password) {
      updateSeekerInput.password = this.hashPasswordIfNotHashed(updateSeekerInput.password);
    }
    await this.prismaService.seeker.update({
      where: { id },
      data: {
        ...updateSeekerInput,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(Seeker, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Seeker #${id} not found`);
    }
    await this.prismaService.seeker.delete({
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
