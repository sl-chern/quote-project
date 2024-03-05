import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class LoginReturn {
  @Field(type => String)
  accessToken: string;

  @Field(type => String)
  refreshToken: string;

  @Field(type => User)
  userInfo: string;
}
