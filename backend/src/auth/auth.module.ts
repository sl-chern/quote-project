import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { UserRepository } from 'src/database/repository/user.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [DatabaseModule, RedisModule, ConfigModule.forFeature(jwtConfig)],
  providers: [JwtStrategy, UserRepository],
  exports: [],
})
export class AuthModule {}
