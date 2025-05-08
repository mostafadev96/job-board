import { Field, InputType } from "@nestjs/graphql";
import { ContractType } from "../../../../graphql/enums/contract-type";
import { $Enums } from "@prisma/client";

@InputType()
export class CreateJobInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  country: string;

  @Field(() => ContractType)
  contractType: $Enums.job_contracttype_enum;

}