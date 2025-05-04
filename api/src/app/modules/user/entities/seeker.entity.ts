import { Column, Entity, OneToMany } from "typeorm";
import { Application } from "../../job/entities/application.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
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

  @Field(() => GraphQLJSON)
  experiences: JSON;

  @Field(() => GraphQLJSON)
  education: JSON;

  @OneToMany(() => Application, (application) => application.seeker)
  @Field(type => [Application], { nullable: true })
  applications?: Application[];
}