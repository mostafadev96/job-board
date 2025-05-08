import { ObjectType } from "@nestjs/graphql";
import { User } from "./user.entity";

@ObjectType({
  implements: () => [User],
})
export class Admin extends User {
  
}