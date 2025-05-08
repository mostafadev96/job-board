import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateApplicationInput } from "./create-application.input";

@InputType()
export class UpdateApplicationInput extends PartialType(CreateApplicationInput) {
  @Field()
  id: string;
}