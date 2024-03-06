import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { AuthResolver } from './auth.resolver';
import { PermissionRepository } from 'src/database/repository/permission.repository';
import { UserRepository } from 'src/database/repository/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuthService, AuthResolver, PermissionRepository, UserRepository],
  imports: [
    UserModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (cfg: ConfigType<typeof jwtConfig>) => cfg,
      inject: [jwtConfig.KEY],
    }),
  ],
})
export class AuthGqlModule {}
