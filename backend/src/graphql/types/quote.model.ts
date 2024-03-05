import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Quote {
  @Field(type => ID)
  id?: string;

  @Field(type => String)
  text: string;

  @Field(type => String, { nullable: true })
  history?: string;

  @Field(type => User)
  author: User;
}
