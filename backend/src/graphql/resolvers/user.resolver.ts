import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from '../types/user.model';
import { UserService } from '../services/user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async getUserById(@Args('userId') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(returns => User)
  async getUserByEmail(@Args('userEmail') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }
}
