import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  signup(signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
