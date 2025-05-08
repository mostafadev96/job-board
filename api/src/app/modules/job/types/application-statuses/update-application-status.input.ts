import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateApplicationStatusInput } from "./create-application-status.input";
@InputType()
export class UpdateApplicationStatusInput extends PartialType(CreateApplicationStatusInput) {
  @Field()
  id: string;
}