import { registerEnumType } from "@nestjs/graphql";

export enum ContractType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
}

registerEnumType(ContractType, {
  name: 'ContractType',
  description: 'The type of contract for the job',
});