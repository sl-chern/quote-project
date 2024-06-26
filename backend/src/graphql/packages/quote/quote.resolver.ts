import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlUser } from '../../../auth/decorators/gql-user.decorator';
import { UserPrincipal } from '../../../auth/interfaces/user-principal.interface';
import { Quote } from '../../../graphql/types/quote.model';
import { QuoteService } from './quote.service';
import { CreateQuoteInput } from './dto/create-quote.input';
import { GetQuotesInput } from './dto/get-quotes.input';
import { UpdateQuoteInput } from './dto/update-quote.input';

@Resolver(of => Quote)
export class QuoteResolver {
  constructor(private readonly quoteService: QuoteService) {}

  @Mutation(returns => Quote)
  async createQuote(
    @Args('quoteInput') quoteInput: CreateQuoteInput,
    @GqlUser() user: UserPrincipal,
  ) {
    return this.quoteService.createQuote(quoteInput, user.email);
  }

  @Query(returns => Quote)
  async getQuoteById(@Args('quoteId') id: string): Promise<Quote> {
    return this.quoteService.getQuoteById(id);
  }

  @Query(returns => [Quote])
  async getQuotes(@Args('getQuotesInput') getQuotesInput: GetQuotesInput): Promise<Array<Quote>> {
    return this.quoteService.getQuotes(getQuotesInput);
  }

  @Mutation(returns => Quote)
  async deleteQuote(@Args('quoteId') id: string, @GqlUser() user: UserPrincipal): Promise<void> {
    this.quoteService.deleteQuote(id, user.email);
  }

  @Mutation(returns => Quote)
  async updateQuote(
    @Args('updateQuoteInput') updateQuoteInput: UpdateQuoteInput,
    @GqlUser() user: UserPrincipal,
  ): Promise<void> {
    this.quoteService.updateQuote(updateQuoteInput, user.email);
  }
}
