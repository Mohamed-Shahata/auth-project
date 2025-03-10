import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

  @IsString()
  @MaxLength(250)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}