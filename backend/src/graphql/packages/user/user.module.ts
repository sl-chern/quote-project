import { Module } from '@nestjs/common';
import { UserRepository } from 'src/database/repository/user.repository';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserRepository, UserService, UserResolver],
  imports: [],
  exports: [UserService],
})
export class UserModule {}
