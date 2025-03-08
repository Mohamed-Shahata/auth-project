import { IsString, IsNumber, IsNotEmpty, Min, MinLength, MaxLength, Length } from "class-validator";

export class CreateProductDto {

  @IsString({ message: "title should be string, custom message" })
  @IsNotEmpty()
  // @MinLength(3)
  // @MaxLength(60)
  @Length(2, 150)
  title: string;

  @IsString()
  description: string

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number
}