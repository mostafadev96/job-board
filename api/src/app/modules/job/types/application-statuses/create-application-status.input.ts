import { Field, InputType } from '@nestjs/graphql';
import { ApplicationStatusEnum } from '../../../../graphql/enums/application-status';

@InputType()
export class CreateApplicationStatusInput {
  @Field()
  applicationId: string;

  @Field()
  recruiterId: string;

  @Field({ nullable: true })
  recruiterName?: string;

  @Field({ nullable: true })
  recruiterResponse?: string;

  @Field((type) => ApplicationStatusEnum)
  status: ApplicationStatusEnum;
}
