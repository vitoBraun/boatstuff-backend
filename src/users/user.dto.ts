import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}

export class GetUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @Exclude()
  hashedPassword: string;

  @IsEmail()
  email: string;
}
