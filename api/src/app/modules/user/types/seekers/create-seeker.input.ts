import { InputType } from '@nestjs/graphql';
import { CreateUserInput } from '../create-user.input';

@InputType()
export class CreateSeekerInput extends CreateUserInput {}