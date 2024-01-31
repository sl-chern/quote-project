import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field()
  login: string;

  @Field({ nullable: true })
  displayName?: string;
}
