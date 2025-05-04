import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateHiringCompanyInput {
  @Field()
  @IsString()
  @MaxLength(60)
  title: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  country: string;

}