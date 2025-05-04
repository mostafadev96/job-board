import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateSeekerInput } from './create-seeker.input';

@InputType()
export class UpdateSeekerInput extends PartialType(CreateSeekerInput) {
    @Field()
    @IsUUID()
    id: string;
}