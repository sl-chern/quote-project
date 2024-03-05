import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from '../types/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { LoginReturn } from '../types/login.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HasPermissionsGuard } from 'src/auth/guards/has-permission.guard';
import { HasPermissions } from 'src/auth/decorators/has-permissions.decorator';
import { PermissionType } from 'src/auth/helpers/permission-type.enum';
import { RegistrationInput } from '../dto/registration.input';
import { LoginInput } from '../dto/login.input';

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
