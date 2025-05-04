import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Recruiter } from "../../user/entities/recruiter.entity";
import { Job } from "../../job/entities/job.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class HiringCompany {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({type: 'text', nullable: true})
  description?: string;

  @Field()
  @Column()
  country: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updatedAt: Date;

  @Field(type => [Job], { nullable: true })
  @OneToMany(() => Job, (job) => job.company)
  jobs?: Job[];

  @OneToMany(() => Recruiter, (recruiter) => recruiter.hiringCompany)
  @Field(type => [Recruiter], { nullable: true })
  recruiters?: Recruiter[];
}