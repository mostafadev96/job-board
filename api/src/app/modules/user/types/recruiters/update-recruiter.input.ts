import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRecruiterInput } from './create-recruiter.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateRecruiterInput extends PartialType(CreateRecruiterInput) {
    @Field()
    @IsUUID()
    id: string;
}