import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserPrincipal } from '../interfaces/user-principal.interface';
import { PermissionType } from '../helpers/permission-type.enum';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWTFromCookie]),
      secretOrKey: config.secret,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    return req.cookies?.access_token || null;
  }

  validate(payload: JwtPayload): UserPrincipal {
    return {
      email: payload.email,
      name: payload.name,
      permissions: payload.permissions as PermissionType[] | undefined,
    };
  }
}
