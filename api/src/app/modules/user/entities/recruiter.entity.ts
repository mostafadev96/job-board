import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Job } from "../../job/entities/job.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { HiringCompany } from "../../hiring-company/entities/hiring-company.entity";
import { User } from "./user.entity";

@ObjectType({
  implements: () => [User],
})
@Entity()
export class Recruiter extends User {
  
  @Field()
  @Column({ default: false })
  companyAdmin: boolean;

  @Field()
  @Column({ nullable: true })
  companyId: string;
  
  @ManyToOne(() => HiringCompany, (company) => company.recruiters)
  @JoinColumn({ name: 'companyId' })
  @Field(type => HiringCompany, )
  hiringCompany: HiringCompany;

  @OneToMany(() => Job, (job) => job.publisher)
  @Field(type => [Job], { nullable: true })
  publishedJobs?: Job[];
}