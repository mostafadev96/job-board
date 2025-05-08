import { Column, Entity, OneToMany } from "typeorm";
import { Application } from "../../job/entities/application.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user.entity";
import GraphQLJSON from "graphql-type-json";

@ObjectType({
  implements: () => [User],
})
@Entity()
export class Seeker extends User {

  @Field()
  @Column({ unique: true })
  phone: string;

  @Column('json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  experiences?: JSON;

  @Column('json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  education?: JSON;

  @OneToMany(() => Application, (application) => application.seeker)
  @Field(type => [Application], { nullable: true })
  applications?: Application[];
}