import { Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Admin } from '../entities/admin.entity';
import { CreateAdminInput } from '../types/admins/create-admin.input';
import { UpdateAdminInput } from '../types/admins/update-admin.input';
import * as bcrypt from 'bcrypt';
import { isStringHashed } from '../utils/hashs';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: Prisma.adminWhereInput
  ): Promise<Admin[]> {
    const res = await  this.prismaService.admin.findMany({
      ...(paginationArgs.limit ? { take: paginationArgs.limit } : {}),
      ...(paginationArgs.offset ? { skip: paginationArgs.offset } : {}),
      ...(filters ? { where: filters } : {}),
    })
    return plainToInstance(Admin, res);
  }

  public async findOneById(id: string): Promise<Admin> {
    const entity = await this.prismaService.admin.findFirst({
      where: { id },
    });

    if (!entity) {
      throw new UserInputError(`Admin #${id} not found`);
    }
    return plainToInstance(Admin, entity);
  }

  public async findByProp(data: Prisma.adminWhereInput) {
    const entity = await this.prismaService.admin.findFirst({
      where: data,
    });
    if (!entity) {
      throw new UserInputError(`Admin not found`);
    }
    return plainToInstance(Admin, entity);
  }

  public async create(
    createAdminInput: CreateAdminInput
  ): Promise<Admin> {
    const entity = this.prismaService.admin.create({
      data: {
        ...createAdminInput,
        password: this.hashPasswordIfNotHashed(createAdminInput.password),
      },
    });
    return plainToInstance(Admin, entity);
  }

  public async update(
    id: string,
    updateAdminInput: UpdateAdminInput
  ): Promise<Admin> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Admin #${id} not found`);
    }
    if (updateAdminInput.password) {
      updateAdminInput.password = this.hashPasswordIfNotHashed(updateAdminInput.password);
    }
    await this.prismaService.admin.update({
      where: { id },
      data: {
        ...updateAdminInput,
      },
    });
    const newEntity = await this.findOneById(id);
    return plainToInstance(Admin, newEntity);
  }

  public async remove(id: string) {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new UserInputError(`Admin #${id} not found`);
    }
    await this.prismaService.admin.delete({
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
