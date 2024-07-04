import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { BadRequestException, Inject, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { HasPermissionsGuard } from '../../../auth/guards/has-permission.guard';
import { HasPermissions } from '../../../auth/decorators/has-permissions.decorator';
import { PermissionType } from '../../../auth/helpers/permission-type.enum';
import { AuthService } from './auth.service';
import { User } from '../../../graphql/types/user.model';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { RegistrationInput } from './dto/registration.input';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_TTL } from 'src/auth/helpers/auth.constants';
import { jwtExpToMilliseconds } from 'src/helpers/jwtExpToMilliseconds';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { cookiesNames } from 'src/helpers/constants';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { GqlUser } from 'src/auth/decorators/gql-user.decorator';
import { UserPrincipal } from 'src/auth/interfaces/user-principal.interface';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private jwtCfg: ConfigType<typeof jwtConfig>,
  ) {}

  setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie(cookiesNames.accessToken, accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: jwtExpToMilliseconds(this.jwtCfg.signOptions.expiresIn),
    });
    res.cookie(cookiesNames.refreshToken, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: REFRESH_TOKEN_TTL,
    });
  };

  removeAuthCookies = (res: Response) => {
    res.clearCookie(cookiesNames.accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.clearCookie(cookiesNames.refreshToken, {
      httpOnly: true,
      secure: true,
    });
  };

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() { res }: { res: Response },
  ): Promise<User> {
    const loginInfo = await this.authService.login(loginInput);
    this.setAuthCookies(res, loginInfo.accessToken, loginInfo.refreshToken);
    return loginInfo.userInfo;
  }

  @Mutation(() => Boolean)
  async refresh(@Context() { req }: { req: Request }, @Context() { res }: { res: Response }) {
    try {
      if (!req?.cookies?.refresh_token) throw new BadRequestException('Token not exist');
      const decoded = JSON.parse(atob(req.cookies.refresh_token)) as JwtPayload;
      console.log(decoded);
      const tokens = await this.authService.refresh({
        id: decoded.id,
        refresh_token: req.cookies.refresh_token,
      });
      this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      return true;
    } catch (err) {
      this.removeAuthCookies(res);
      return err;
    }
  }

  @Mutation(() => User)
  async registration(@Args('registrationInput') registrationInput: RegistrationInput) {
    return this.authService.registration(registrationInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async verifyUser(@GqlUser() user: UserPrincipal) {
    return this.userService.findByEmail(user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async logout(@GqlUser() user: UserPrincipal, @Context() { res }: { res: Response }) {
    this.authService.logout(user.id);
    this.removeAuthCookies(res);
    return true;
  }

  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(PermissionType.READ_POSTS)
  @Query(() => User)
  async getUserByEmail(@Args('userEmail') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }
}
