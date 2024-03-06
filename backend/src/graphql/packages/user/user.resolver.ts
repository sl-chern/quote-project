import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from 'src/graphql/types/user.model';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async getUserById(@Args('userId') id: string): Promise<User> {
    return this.userService.findById(id);
  }
}
