import { Module } from '@nestjs/common';
import { UserRepository } from '../../../database/repository/user.repository';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { BucketModule } from 'src/bucket/bucket.module';

@Module({
  providers: [UserRepository, UserService, UserResolver],
  imports: [BucketModule],
  exports: [UserService],
})
export class UserModule {}
