import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApplicationStatusEnum } from '../../../graphql/enums/application-status';
import { Application } from './application.entity';
import { Recruiter } from '../../user/entities/recruiter.entity';
import { Type } from 'class-transformer';

@ObjectType()
export class ApplicationStatus {
  @Field(() => ID)
  id: string;

  @Field()
  applicationId: string;

  @Field()
  recruiterId: string;

  @Field({ nullable: true })
  recruiterName?: string;

  @Field({ nullable: true })
  recruiterResponse?: string;

  @Field(type => ApplicationStatusEnum)
  status: ApplicationStatusEnum;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Type(() => Application)
  @Field(type => Application)
  application: Application;

  @Type(() => Recruiter)
  @Field(type => Recruiter)
  recruiter: Recruiter;
}
