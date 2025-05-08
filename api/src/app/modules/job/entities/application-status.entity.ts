import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApplicationStatusEnum } from '../../../graphql/enums/application-status';
import { Application } from './application.entity';
import { Recruiter } from '../../user/entities/recruiter.entity';

@ObjectType()
@Entity()
export class ApplicationStatus {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  applicationId: string;

  @Field()
  @Column()
  recruiterId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recruiterName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recruiterResponse?: string;

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

  @ManyToOne(() => Application, (application) => application.applicationStatuses, {
    eager: true,
  })
  @JoinColumn({ name: 'applicationId' })
  @Field(type => Application)
  application: Application;

  @ManyToOne(() => Recruiter, {
    eager: true,
  })
  @JoinColumn({ name: 'recruiterId' })
  @Field(type => Recruiter)
  recruiter: Recruiter;
}
