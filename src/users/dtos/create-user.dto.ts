import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  password: string;
}
