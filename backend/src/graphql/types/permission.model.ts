import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field(type => ID)
  id?: string;

  @Field(type => String, { nullable: true })
  name?: string;
}
