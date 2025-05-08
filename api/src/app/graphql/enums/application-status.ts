import { registerEnumType } from "@nestjs/graphql";

export enum ApplicationStatusEnum {
    APPLIED = 'APPLIED',
    INTERVIEW = 'INTERVIEW',
    OFFER = 'OFFER',
    HIRED = 'HIRED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
}

registerEnumType(ApplicationStatusEnum, {
  name: 'ApplicationStatusTypes',
  description: 'The current status of the application',
});