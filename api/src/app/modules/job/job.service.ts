import { Injectable } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateJobInput } from './types/create-job.input';
import { UpdateJobInput } from './types/update-job.input';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>
  ) {}

  getAllJobs() {
    return this.jobRepository.find();
  }

  getJobById(id: string) {
    return this.jobRepository.findOne({ where: { id } });
  }

  getJobByProperty(data: FindOptionsWhere<Job>) {
    return this.jobRepository.findOneBy(data);
  }

  createJob(input: CreateJobInput) {
    return this.jobRepository.save(
      this.jobRepository.create(input)
    );
  }

  async updateJob(input: UpdateJobInput) {
    const { id, ...data } = input;
    const job = this.jobRepository.findOne({ where: { id } });
    if (!job) return null;
    await this.jobRepository.save(
      this.jobRepository.create({
        id,
        ...data,
      })
    );
  }

  async deleteJob(id: string) {
    await this.jobRepository.delete(id);
    return true;
  }
}
