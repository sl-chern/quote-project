import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateQuoteInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  history: string;
}
