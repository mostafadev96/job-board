import { Field, ID, InterfaceType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { isStringHashed } from "../utils/hashs";

@InterfaceType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Boolean)
  @Column({ default: true })
  active: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if(!isStringHashed(this.password)) {
      const salt = bcrypt.genSaltSync();
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }
}