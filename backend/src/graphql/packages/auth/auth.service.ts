import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PermissionRepository } from '../../../database/repository/permission.repository';
import { PermissionType } from '../../../auth/helpers/permission-type.enum';
import { UserRepository } from '../../../database/repository/user.repository';
import { RedisService } from '../../../redis/redis.service';
import { JwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { REFRESH_TOKEN_TTL } from '../../../auth/helpers/auth.constants';
import { RefreshInput } from './dto/refresh.input';
import { LoginInput } from './dto/login.input';
import { RegistrationInput } from './dto/registration.input';
import { TokensReturn } from 'src/graphql/types/refresh.model';
import { LoginReturn } from 'src/graphql/types/login.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async getTokens(payload: JwtPayload): Promise<TokensReturn> {
    const accessToken = await this.jwtService.signAsync(payload);
    const randomUUId = crypto.randomUUID();
    const refreshToken = btoa(JSON.stringify({ ...payload, token: randomUUId }));

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginInput: LoginInput): Promise<LoginReturn> {
    const user = await this.userRepository.findByEmail(loginInput.email.toLowerCase());

    if (!user) throw new BadRequestException('User does not exist');

    if (!user.is_confirmed) throw new ForbiddenException(`The user's email is not confirmed`);
    if (!user.password) throw new BadRequestException('Password does not exist');

    const passwordsCompairing = await bcrypt.compare(loginInput.password, user.password);
    if (!passwordsCompairing) throw new BadRequestException('Incorrect password');

    const userInfo = { ...user };

    delete userInfo.password;
    delete userInfo.is_confirmed;

    const tokens = await this.getTokens({
      email: userInfo.email,
      name: userInfo.name,
      permissions: userInfo.permissions.map(permission => permission.name),
    });

    this.updateRefreshToken(userInfo.id, tokens.refreshToken);
    return {
      ...tokens,
      userInfo,
    };
  }

  async refresh(refreshInput: RefreshInput): Promise<TokensReturn> {
    const user = await this.userRepository.findOne({
      where: {
        id: refreshInput.id,
      },
      relations: ['permissions'],
    });
    if (!user || !refreshInput.refresh_token) throw new BadRequestException('User does not exist');

    const currentRefreshToken = await this.redisService.get(user.id.toString());
    if (currentRefreshToken !== refreshInput.refresh_token)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({
      email: user.email,
      name: user.name,
      permissions: user.permissions.map(permission => permission.name),
    });
    this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new BadRequestException('User does not exist');
    this.redisService.delete(user.id.toString());
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.redisService.set(id.toString(), refreshToken, REFRESH_TOKEN_TTL);
  }

  async registration(registrationInput: RegistrationInput) {
    const { email, name, password } = registrationInput;
    const hashedPassword = await bcrypt.hash(password, 5);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) throw new BadRequestException('User with this email exists');

    let user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      is_confirmed: true,
    });

    user = await this.userRepository.save(user);
    const permissions = await this.permissionRepository.findByNames([PermissionType.READ_POSTS]);
    user.permissions = permissions;

    return this.userRepository.save(user);
  }

  private async setGoogleAccessToken() {}
  async googleAuthentication() {}
}
