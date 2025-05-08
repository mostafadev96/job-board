import { Job } from './job.entity';
import { Seeker } from '../../user/entities/seeker.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApplicationStatus } from './application-status.entity';
import { ContractType } from '../../../graphql/enums/contract-type';
import { ApplicationStatusEnum } from '../../../graphql/enums/application-status';
import { Type } from 'class-transformer';

@ObjectType()
export class Application {
  @Field(() => ID)
  id: string;

  @Field()
  seekerId: string;

  @Field({ nullable: true })
  seekerName?: string;

  @Field({ nullable: true })
  seekerPhone?: string;

  @Field({ nullable: true })
  seekerEmail?: string;

  @Field({ nullable: true })
  seekerShortDescription?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  experiences?: JSON;

  @Field(() => GraphQLJSON, { nullable: true })
  education?: JSON;

  @Field()
  jobId: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field(type => ContractType, { nullable: true })
  jobContractType?: ContractType;

  @Field(type => ApplicationStatusEnum)
  status: ApplicationStatusEnum;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Type(() => Seeker)
  @Field(type => Seeker)
  seeker: Seeker;

  @Type(() => Job)
  @Field(type => Job)
  job: Job;

  @Type(() => ApplicationStatus)
  @Field(type => [ApplicationStatus], { nullable: true })
  applicationStatuses?: ApplicationStatus[];
}
