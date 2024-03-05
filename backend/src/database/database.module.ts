import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { PermissionEntity } from './entity/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PermissionEntity])],
  exports: [TypeOrmModule, UserRepository],
  providers: [UserRepository],
})
export class DatabaseModule {}
