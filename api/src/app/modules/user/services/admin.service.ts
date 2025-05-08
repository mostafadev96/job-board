import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { Admin } from '../entities/admin.entity';
import { CreateAdminInput } from '../types/admins/create-admin.input';
import { UpdateAdminInput } from '../types/admins/update-admin.input';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly usersRepository: Repository<Admin>
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: FindOptionsWhere<Admin>
  ): Promise<Admin[]> {
    const { limit, offset } = paginationArgs;
    return this.usersRepository.find({
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
      ...(filters ? { where: filters } : {}),
    });
  }

  public async findOneById(id: string): Promise<Admin> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  public async findByProp(data: FindOptionsWhere<Admin>) {
    return this.usersRepository.findOneBy(data);
  }

  public async create(createUserInput: CreateAdminInput): Promise<Admin> {
    const user = this.usersRepository.create({ ...createUserInput });
    return this.usersRepository.save(user);
  }

  public async update(
    id: string,
    updateUserInput: UpdateAdminInput
  ): Promise<Admin> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserInput,
    });

    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return this.usersRepository.save(user);
  }

  public async remove(id: string) {
    const user = await this.findOneById(id);
    return this.usersRepository.remove(user);
  }
}
