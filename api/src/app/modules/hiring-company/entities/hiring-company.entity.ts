import { Recruiter } from "../../user/entities/recruiter.entity";
import { Job } from "../../job/entities/job.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Type } from 'class-transformer';

@ObjectType()
export class HiringCompany {
  
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  country: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(type => [Job], { nullable: true })
  @Type(() => Job)
  jobs?: Job[];

  @Field(type => [Recruiter], { nullable: true })
  @Type(() => Recruiter)
  recruiters?: Recruiter[];
}