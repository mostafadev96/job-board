import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { Seeker } from '../entities/seeker.entity';
import { CreateSeekerInput } from '../types/seekers/create-seeker.input';
import { UpdateSeekerInput } from '../types/seekers/update-seeker.input';

@Injectable()
export class SeekerService {
  constructor(
    @InjectRepository(Seeker)
    private readonly usersRepository: Repository<Seeker>
  ) {}

  public async findAll(
    paginationArgs: PaginationArgs,
    filters?: FindOptionsWhere<Seeker>
  ): Promise<Seeker[]> {
    const { limit, offset } = paginationArgs;
    return this.usersRepository.find({
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
      ...(filters ? { where: filters } : {}),
    });
  }

  public async findOneById(id: string): Promise<Seeker> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  public async findByProp(data: FindOptionsWhere<Seeker>) {
    return this.usersRepository.findOneBy(data);
  }

  public async create(createUserInput: CreateSeekerInput): Promise<Seeker> {
    createUserInput.password = bcrypt.hashSync(createUserInput.password, 8);

    const user = this.usersRepository.create({ ...createUserInput });
    return this.usersRepository.save(user);
  }

  public async update(
    id: string,
    updateUserInput: UpdateSeekerInput
  ): Promise<Seeker> {
    updateUserInput.password = bcrypt.hashSync(updateUserInput.password, 8);

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
