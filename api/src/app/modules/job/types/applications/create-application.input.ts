import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ContractType } from '../../../../graphql/enums/contract-type';

@InputType()
export class CreateApplicationInput {
  @Field()
  seekerId: string;

  @Field()
  jobId: string;

  @Field({ nullable: true })
  seekerName?: string;

  @Field({ nullable: true })
  seekerPhone?: string;

  @Field({ nullable: true })
  seekerEmail?: string;

  @Field({ nullable: true })
  seekerShortDescription?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  experiences?: JSON;

  @Field(() => GraphQLJSON, { nullable: true })
  education?: JSON;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field((type) => ContractType, { nullable: true })
  jobContractType?: ContractType;

}
