import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Permission } from './permission.model';

@ObjectType()
export class User {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  email: string;

  @Field(type => [Permission], { nullable: true })
  permissions: Array<Permission>;
}
