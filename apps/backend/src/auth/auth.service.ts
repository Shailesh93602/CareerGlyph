import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.developer.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 10);
    const developer = await this.prisma.developer.create({
      data: {
        username: dto.username,
        name: dto.name,
        email: dto.email,
        password: hash,
        bio: dto.bio,
        isPublic: true,
      },
    });

    const token = this.signToken(developer.id, developer.username);
    return { accessToken: token, username: developer.username };
  }

  async login(dto: LoginDto) {
    const developer = await this.prisma.developer.findUnique({
      where: { email: dto.email },
    });
    if (!developer) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, developer.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.signToken(developer.id, developer.username);
    return { accessToken: token, username: developer.username };
  }

  private signToken(sub: string, username: string): string {
    return this.jwtService.sign({ sub, username }, { expiresIn: '7d' });
  }

  getHealth(): string {
    return 'Auth service is running';
  }
}
