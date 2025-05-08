import { Application } from "../../job/entities/application.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user.entity";
import GraphQLJSON from "graphql-type-json";
import { Type } from "class-transformer";

@ObjectType({
  implements: () => [User],
})
export class Seeker extends User {

  @Field()
  phone: string;

  @Field(() => GraphQLJSON, { nullable: true })
  experiences?: JSON;

  @Field(() => GraphQLJSON, { nullable: true })
  education?: JSON;

  @Type(() => Application)  
  @Field(type => [Application], { nullable: true })
  applications?: Application[];
}