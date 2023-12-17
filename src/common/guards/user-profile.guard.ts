import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UserProfileGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        throw new UnauthorizedException("Login bilan kiring")
    }

    try {
      const decodedToken: any = this.jwtService.verify(token, {secret: process.env.ACCESS_TOKEN_SECRET});
      const userId = decodedToken.sub; // Assuming the user ID is stored in the 'sub' claim of the token

      return User.findOne({ where: { id: userId } }).then(user => {
        if (user) {
          request.body.user = user;

          return true;
        } else {
          throw new UnauthorizedException();
        }
      }).catch(err => {
        console.log(err);
        return false;
      });
          } catch (error) {
        console.log('xatolik', error.message);
      return false
    }
  }
}