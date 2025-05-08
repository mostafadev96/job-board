import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Recruiter } from "../../user/entities/recruiter.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { HiringCompany } from "../../hiring-company/entities/hiring-company.entity";
import { ContractType } from "../../../graphql/enums/contract-type";

@ObjectType()
@Entity()
export class Job {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({type: 'text'})
  description: string;

  @Field()
  @Column()
  country: string;

  @Field(type => ContractType)
  @Column({ type: 'enum', enum: ContractType })
  contractType: ContractType;

  @Field()
  @Column({ default: true })
  active: boolean;

  @Field()
  @Column()
  publisherId: string;

  @Field()
  @Column()
  companyId: string;

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

  @ManyToOne(() => Recruiter, {
    eager: true
  })
  @Field(type => Recruiter)
  @JoinColumn({ name: 'publisherId' })
  publisher: Recruiter;

  @ManyToOne(() => HiringCompany, {
    eager: true
  })
  @JoinColumn({ name: 'companyId' })
  @Field(type => HiringCompany)
  company: HiringCompany;

  @OneToMany(() => Application, (application) => application.job)
  @Field(type => [Application], { nullable: true })
  applications?: Application[];
}