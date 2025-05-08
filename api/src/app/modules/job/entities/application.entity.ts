import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Job } from './job.entity';
import { Seeker } from '../../user/entities/seeker.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApplicationStatus } from './application-status.entity';
import { ContractType } from '../../../graphql/enums/contract-type';
import { ApplicationStatusEnum } from '../../../graphql/enums/application-status';

@ObjectType()
@Entity()
export class Application {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  seekerId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seekerName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seekerPhone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seekerEmail?: string;

  @Field({ nullable: true })
  @Column({type: 'text', nullable: true })
  seekerShortDescription?: string;

  @Column('json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  experiences?: JSON;

  @Column('json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  education?: JSON;

  @Field()
  @Column()
  jobId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  jobTitle?: string;

  @Field(type => ContractType, { nullable: true })
  @Column({ type: 'enum', enum: ContractType, nullable: true })
  jobContractType?: ContractType;

  @Field(type => ApplicationStatusEnum)
  @Column({ type: 'enum', enum: ApplicationStatusEnum, default: ApplicationStatusEnum.APPLIED })
  status: ApplicationStatusEnum;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updated_at: Date;

  @ManyToOne(() => Seeker, (seeker) => seeker.applications, {
    eager: true,
  })
  @JoinColumn({ name: 'seekerId' })
  @Field(type => Seeker)
  seeker: Seeker;

  @ManyToOne(() => Job, (job) => job.applications, {
    eager: true,
  })
  @JoinColumn({ name: 'jobId' })
  @Field(type => Job)
  job: Job;

  @OneToMany(() => ApplicationStatus, (appStatus) => appStatus.application)
  @Field(type => [ApplicationStatus], { nullable: true })
  applicationStatuses?: ApplicationStatus[];
}
