import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGqlModule, UserModule, QuoteModule } from './packages';

@Module({
  imports: [DatabaseModule, AuthModule, AuthGqlModule, UserModule, QuoteModule],
  providers: [],
  exports: [],
})
export class GqlApiModule {}
