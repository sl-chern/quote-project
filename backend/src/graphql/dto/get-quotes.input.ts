import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class GetQuotesInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  type: 'recommended' | 'for you';

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
