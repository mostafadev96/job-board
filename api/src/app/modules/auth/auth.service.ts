import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Seeker } from "../user/entities/seeker.entity";
import { JwtService } from "@nestjs/jwt";
import { Recruiter } from "../user/entities/recruiter.entity";
import * as bcrypt from 'bcrypt';
import { LoginDto, UserRole } from "./dtos/login.dto";
import { Admin } from "../user/entities/admin.entity";
import { SignupDto } from "./dtos/signup.dto";
import { RecruiterService } from "../user/services/recruiter.service";
import { AdminService } from "../user/services/admin.service";
import { SeekerService } from "../user/services/seeker.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly recruiterService: RecruiterService,
    private readonly adminService: AdminService,
    private readonly seekerService: SeekerService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password, role } = dto;

    let user: Admin | Seeker | Recruiter | null = null;

    switch (role) {
      case UserRole.ADMIN:
        user = await this.adminService.findByProp({ email } );
        break;
      case UserRole.SEEKER:
        user = await this.seekerService.findByProp({ email } );
        break;
      case UserRole.RECRUITER:
        user = await this.recruiterService.findByProp({ email } );
        break;
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if(!user.active) {
      throw new UnauthorizedException('User is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role,
    };

    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user,
    };
  }

  async signup(dto: SignupDto) {
    const oldUser = await this.seekerService.findByProp({ email: dto.email });
    if (oldUser) {
      throw new UnauthorizedException('Use another email');
    }

    const newUser = await this.seekerService.create({
      ...dto,
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: UserRole.SEEKER,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: newUser,
    };
  }
}
