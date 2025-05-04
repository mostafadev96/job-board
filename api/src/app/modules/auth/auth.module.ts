import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../user/entities/admin.entity';
import { Seeker } from '../user/entities/seeker.entity';
import { Recruiter } from '../user/entities/recruiter.entity';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    TypeOrmModule.forFeature([Admin, Seeker, Recruiter]),
    UserModule
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  controllers: [
    AuthController
  ],
  exports: [AuthService],
})
export class AuthModule {}
