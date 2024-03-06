import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class RefreshInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
