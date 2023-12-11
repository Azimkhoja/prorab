import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, UsersService, RefreshTokenStrategy, JwtService],
})
export class AuthModule {}
