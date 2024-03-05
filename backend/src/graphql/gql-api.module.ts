import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { UserRepository } from 'src/database/repository/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { PermissionRepository } from 'src/database/repository/permission.repository';
import { QuoteRepository } from 'src/database/repository/quote.repository';
import { QuoteResolver } from './resolvers/quote.resolver';
import { QuoteService } from './services/quote.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (cfg: ConfigType<typeof jwtConfig>) => cfg,
      inject: [jwtConfig.KEY],
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    AuthResolver,
    AuthService,
    PermissionRepository,
    QuoteRepository,
    QuoteService,
    QuoteResolver,
  ],
  exports: [],
})
export class GqlApiModule {}
