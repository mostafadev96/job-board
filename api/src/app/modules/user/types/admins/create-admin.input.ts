import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput } from '../create-user.input';

@InputType()
export class CreateAdminInput extends CreateUserInput {
  @Field()
  active?: boolean;
}
