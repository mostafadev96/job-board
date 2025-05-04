import { ObjectType } from "@nestjs/graphql";
import { Entity } from "typeorm";
import { User } from "./user.entity";

@ObjectType({
  implements: () => [User],
})
@Entity()
export class Admin extends User {
  
}