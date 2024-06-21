import { Module } from '@nestjs/common';
import { QuoteRepository } from '../../../database/repository/quote.repository';
import { QuoteResolver } from './quote.resolver';
import { QuoteService } from './quote.service';
import { UserRepository } from '../../../database/repository/user.repository';

@Module({
  providers: [QuoteRepository, QuoteResolver, QuoteService, UserRepository],
  imports: [],
  exports: [],
})
export class QuoteModule {}
