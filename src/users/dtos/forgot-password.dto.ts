import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ForgotPasswordDto {

  @IsString()
  @MaxLength(250)
  @IsNotEmpty()
  email: string;
}