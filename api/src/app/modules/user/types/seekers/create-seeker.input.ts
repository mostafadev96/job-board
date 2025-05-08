import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput } from '../create-user.input';
import { IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { InputJsonValue } from '@prisma/client/runtime/library';

@InputType()
export class CreateSeekerInput extends CreateUserInput {
    @Field()
    @IsString()
    readonly phone: string;

    @Field(() => GraphQLJSON ,{ nullable: true })
    @IsOptional()
    readonly experiences?: InputJsonValue;
    
    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    readonly education?: InputJsonValue;
}