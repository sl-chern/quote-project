import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => ID)
  id?: number;

  @Field(type => String, { nullable: true })
  name?: string;

  @Field(type => String, { nullable: true })
  email?: string;
}
