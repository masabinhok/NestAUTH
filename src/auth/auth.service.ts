import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma';
import { Role } from 'src/roles/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}


  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { fullName, email, password } = signUpDto;

    const user = await this.usersService.findUserByEmail(email);
    const userCount = await this.prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    if (user) {
      return {
        message: 'User with the email already exists.',
      };
    }

    const hashedPassword = await this.hashSecrets(password);

    await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role
      },
    });

    return {
      message: 'Signup Successful!',
    };
  }

  async hashSecrets(secret: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(secret, salt);
    return hash;
  }

  async getUserProfile(userId: number): Promise<Partial<User> | null> {
    const user = await this.usersService.findUserById(userId);
    if (!user) return null;
    return this.usersService.getSafeUser(user);
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(
    userId: number,
    token: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.findUserById(userId);

    if (!user || !user.refreshToken) throw new ForbiddenException();

    const matches = await bcrypt.compare(token, user.refreshToken);

    if (!matches) throw new UnauthorizedException('Invalid token');

    const tokens = await this.generateTokens(userId, user.email, user.role);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await this.hashSecrets(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
  }

  async generateTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpire'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpire'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number): Promise<void> {
    const loggedOutUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });

    if(!loggedOutUser){
      throw new BadRequestException('No user to Logout');
    }
  }
}
