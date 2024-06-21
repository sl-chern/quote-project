import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule, UserModule, QuoteModule } from './packages';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, QuoteModule],
  providers: [],
  exports: [],
})
export class GqlApiModule {}
