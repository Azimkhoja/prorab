import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { response } from 'src/common/response/common-responses';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // foydalanuvchi bor yoki yo'qligin tekshiradi
    const user = await this.usersService.findByUsername(data.username);

    // agar foydalanuvchi topilmasa xatolik qaytaradi(User not found)
    if (!user) throw new BadRequestException("noto'g'ri username yoki parol");

    //loginda kiritgan parol bilan database dagi parolni mosh kelishini tekshiradi

    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches) throw new BadRequestException("noto'g'ri parol!");

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.update(userId, { token: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.token) throw new ForbiddenException('Kirish rad etildi');
    const refreshTokenMatches = await argon2.verify(user.token, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Kirish rad etildi');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  //foydalanuvchiga tegishli refresh tokenni yangilaydi
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      token: hashedRefreshToken,
    });
  }

  // token generatsiya qiladi
  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile(user: any) {
    return response.Ok(200, 'Profile', {
      firs_tname: user.first_name,
      last_name: user.last_name,
      username: user.username,
      created_at: user.created_at,
    });
  }
}
