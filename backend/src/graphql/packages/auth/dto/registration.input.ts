import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class RegistrationInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
