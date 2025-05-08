import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export enum UserRole {
  ADMIN = 'admin',
  SEEKER = 'seeker',
  RECRUITER = 'recruiter',
}

export class SignupDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    password: string;
}
