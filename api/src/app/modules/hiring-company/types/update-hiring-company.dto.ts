import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateHiringCompanyInput } from './create-hiring-company.dto';

@InputType()
export class UpdateHiringCompanyInput extends PartialType(CreateHiringCompanyInput) {
  @Field()
  id: string;
}