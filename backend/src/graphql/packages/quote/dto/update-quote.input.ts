import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

@InputType()
export class UpdateQuoteInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsOptional()
  text: string;

  @Field()
  @IsString()
  @IsOptional()
  history: string;
}
