import { Field, ID, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  password: string;

  @Field()
  name: string;

  @Field(() => Boolean)
  active: boolean;
}