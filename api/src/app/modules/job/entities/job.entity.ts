import { Application } from "./application.entity";
import { Recruiter } from "../../user/entities/recruiter.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { HiringCompany } from "../../hiring-company/entities/hiring-company.entity";
import { ContractType } from "../../../graphql/enums/contract-type";
import { Type } from "class-transformer";

@ObjectType()
export class Job {

  @Field(() => ID)
  id: string; 

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  country: string;

  @Field(type => ContractType)
  contractType: ContractType;

  @Field()
  active: boolean;

  @Field()
  publisherId: string;

  @Field()
  companyId: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(type => Recruiter)
  @Type(() => Recruiter)
  recruiter: Recruiter;

  @Type(() => HiringCompany)
  @Field(type => HiringCompany)
  hiring_company: HiringCompany;

  @Type(() => Application)
  @Field(type => [Application], { nullable: true })
  applications?: Application[];
}