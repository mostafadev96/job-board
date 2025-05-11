import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ContractType } from '../../../../graphql/enums/contract-type';
import { InputJsonValue } from '@prisma/client/runtime/library';

@InputType()
export class CreateApplicationInput {
  @Field()
  jobId: string;

  @Field({ nullable: true })
  seekerShortDescription?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  experiences?: InputJsonValue;

  @Field(() => GraphQLJSON, { nullable: true })
  education?: InputJsonValue;

}
