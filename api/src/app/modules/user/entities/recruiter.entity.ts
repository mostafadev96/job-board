import { Job } from "../../job/entities/job.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { HiringCompany } from "../../hiring-company/entities/hiring-company.entity";
import { User } from "./user.entity";
import { Type } from "class-transformer";

@ObjectType({
  implements: () => [User],
})
export class Recruiter extends User {
  
  @Field()
  companyAdmin: boolean;

  @Field({ nullable: true })
  companyId?: string;
  
  @Type(() => HiringCompany)
  @Field(type => HiringCompany, )
  hiring_company: HiringCompany;

  @Type(() => Job)
  @Field(type => [Job], { nullable: true })
  publishedJobs?: Job[];
}