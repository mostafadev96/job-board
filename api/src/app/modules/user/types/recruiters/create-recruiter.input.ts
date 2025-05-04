import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';
import { CreateUserInput } from '../create-user.input';

@InputType()
export class CreateRecruiterInput extends CreateUserInput {
  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  readonly companyAdmin: boolean;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  readonly active: boolean;

  @Field()
  @IsUUID()
  readonly companyId: string;

}