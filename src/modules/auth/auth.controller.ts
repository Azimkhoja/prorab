import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserProfileGuard } from 'src/common/guards/user-profile.guard';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }
  
  @Get('profile')
  @UseGuards(UserProfileGuard)
  viewProfile(@Req() req: any) {
    return this.authService.getProfile(req.body.user);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch('change-password')
  changePass(@AuthUser() user: User, @Body() passDto: ChangePasswordDto){
    console.log(user, 'controller');
    return this.authService.changePassword(user, passDto)
  }

  // @UseGuards(AccessTokenGuard)
  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }

  // @UseGuards(RefreshTokenGuard)
  // @Get('refresh')
  // refreshTokens(@Req() req: Request) {
  //   const userId = req.user['sub'];
  //   const refreshToken = req.user['refreshToken'];
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }
}