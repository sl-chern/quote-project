import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PermissionRepository } from 'src/database/repository/permission.repository';
import { PermissionType } from 'src/auth/helpers/permission-type.enum';
import { UserRepository } from 'src/database/repository/user.repository';
import { RedisService } from 'src/redis/redis.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { WEEK_IN_MILLISECONDS } from 'src/auth/helpers/auth.constants';
import { RefreshInput } from './dto/refresh.input';
import { LoginInput } from './dto/login.input';
import { RegistrationInput } from './dto/registration.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async getTokens(payload: JwtPayload) {
    try {
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = crypto.randomUUID();

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Error:', error.response || error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(loginInput: LoginInput) {
    try {
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
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userInfo,
      };
    } catch (error) {
      this.logger.error('Error:', error.response || error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async refresh(refreshInput: RefreshInput) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: refreshInput.id,
        },
      });
      if (!user || !refreshInput.refresh_token)
        throw new BadRequestException('User does not exist');

      const currentRefreshToken = await this.redisService.get(user.id.toString());
      if (currentRefreshToken !== refreshInput.refresh_token)
        throw new ForbiddenException('Access Denied');

      const tokens = await this.getTokens({ email: user.email, name: user.name });
      this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      this.logger.error('Error:', error.response || error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async logout(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!user) throw new BadRequestException('User does not exist');
      this.redisService.delete(user.id.toString());
    } catch (error) {
      this.logger.error('Error:', error.response || error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.redisService.set(id.toString(), refreshToken, WEEK_IN_MILLISECONDS);
  }

  async registration(registrationInput: RegistrationInput) {
    try {
      const { email, name, password } = registrationInput;
      const hashedPassword = await bcrypt.hash(password, 5);
      let user = await this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        is_confirmed: true,
      });
      user = await this.userRepository.save(user);
      const permissions = await this.permissionRepository.findByNames([PermissionType.READ_POSTS]);
      user.permissions = permissions;
      return this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Error:', error.response || error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  private async setGoogleAccessToken() {}
  async googleAuthentication() {}
}
