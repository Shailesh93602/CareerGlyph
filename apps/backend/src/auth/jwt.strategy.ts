import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET is required. Set it in .env (generate with: openssl rand -hex 32).'
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    const developer = await this.prisma.developer.findUnique({
      where: { id: payload.sub },
    });
    if (!developer) throw new UnauthorizedException();
    return developer;
  }
}
