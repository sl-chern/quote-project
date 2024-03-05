import { ForbiddenException, Injectable } from '@nestjs/common';
import { QuoteRepository } from 'src/database/repository/quote.repository';
import { Quote } from '../types/quote.model';
import { PermissionType } from 'src/auth/helpers/permission-type.enum';
import { UserRepository } from 'src/database/repository/user.repository';
import { GetQuotesInput } from '../dto/get-quotes.input';

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getQuoteById(id: string): Promise<Quote> {
    return this.quoteRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  async getQuotes(getQuotesInput: GetQuotesInput): Promise<Array<Quote>> {
    if (getQuotesInput.type === 'for you') {
      const authorsQuery = this.userRepository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.following', 'following_users')
        .select(['following_users.id'])
        .where('users.id = :userId', {
          userId: getQuotesInput.userId,
        });

      const quotesQuery = this.quoteRepository
        .createQueryBuilder('quotes')
        .innerJoinAndSelect('quotes.author', 'user')
        .where(`user.id IN (${authorsQuery.getQuery()})`)
        .setParameters(authorsQuery.getParameters());

      return await quotesQuery.getMany();
    } else if (getQuotesInput.type === 'recommended') {
      return [];
    }
  }

  async createQuote(quoteInfo: Partial<Quote>, authorEmail: string) {
    const quote = this.quoteRepository.create(quoteInfo);
    const author = await this.userRepository.findByEmail(authorEmail);
    quote.author = author;
    return this.quoteRepository.save(quote);
  }

  async deleteQuote(id: string, authorEmail: string): Promise<void> {
    const user = await this.userRepository.findByEmail(authorEmail);
    const quote = await this.getQuoteById(id);
    if (
      quote.author.id !== user.id ||
      !user.permissions.some(value => value.name === PermissionType.DELETE_POSTS)
    )
      throw new ForbiddenException(`You don't have premissions`);
    this.quoteRepository.delete(quote.id);
  }

  async updateQuote(quoteInfo: Partial<Quote>, email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    const quote = await this.getQuoteById(quoteInfo.id);
    if (quote.author.id !== user.id) throw new ForbiddenException(`You don't have premissions`);
    this.quoteRepository.update(quoteInfo.id, quoteInfo);
  }
}
