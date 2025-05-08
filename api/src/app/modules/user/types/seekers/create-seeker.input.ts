import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput } from '../create-user.input';
import { IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateSeekerInput extends CreateUserInput {
    @Field(() => GraphQLJSON ,{ nullable: true })
    @IsOptional()
    readonly experiences?: JSON;
    
    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    readonly education?: JSON;
}