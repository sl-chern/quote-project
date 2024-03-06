import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HasPermissionsGuard } from 'src/auth/guards/has-permission.guard';
import { HasPermissions } from 'src/auth/decorators/has-permissions.decorator';
import { PermissionType } from 'src/auth/helpers/permission-type.enum';
import { LoginReturn } from 'src/graphql/types/login.model';
import { AuthService } from './auth.service';
import { User } from 'src/graphql/types/user.model';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { RegistrationInput } from './dto/registration.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(returns => LoginReturn)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<any> {
    return this.authService.login(loginInput);
  }

  @Mutation(returns => User)
  async registration(@Args('registrationInput') registrationInput: RegistrationInput) {
    return this.authService.registration(registrationInput);
  }

  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(PermissionType.READ_POSTS)
  @Query(returns => User)
  async getUserByEmail(@Args('userEmail') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }
}
