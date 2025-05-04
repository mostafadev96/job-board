import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { Recruiter } from '../entities/recruiter.entity';
import { PaginationArgs } from '../../../graphql/inputs/pagination-args.input';
import { CreateRecruiterInput } from '../types/recruiters/create-recruiter.input';
import { UpdateRecruiterInput } from '../types/recruiters/update-recruiter.input';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly usersRepository: Repository<Recruiter>,
  ) {}

  public async findAll(paginationArgs?: PaginationArgs, filters?: FindOptionsWhere<Recruiter>): Promise<Recruiter[]> 
  {
    const { limit, offset } = paginationArgs;
    return this.usersRepository.find({
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
      ...(filters ? { where: filters } : {}),
    });
  }

  public async findOneById(id: string): Promise<Recruiter> {
    const user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          hiringCompany: true,
        },
    });

    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  public async findByProp(data: FindOptionsWhere<Recruiter>) {
    return this.usersRepository.findOneBy(data);
  }

  public async create(createUserInput: CreateRecruiterInput): Promise<Recruiter> {
    createUserInput.password = bcrypt.hashSync(createUserInput.password, 8);

    const user = this.usersRepository.create({ ...createUserInput});
    return this.usersRepository.save(user);
  }

  public async update(
    id: string,
    updateUserInput: UpdateRecruiterInput,
  ): Promise<Recruiter> {
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