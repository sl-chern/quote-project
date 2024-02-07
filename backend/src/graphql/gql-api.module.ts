import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { UserRepository } from 'src/database/repository/user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService, UserRepository],
  exports: [],
})
export class GqlApiModule {}
