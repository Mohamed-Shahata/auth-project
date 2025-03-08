import { IsString, IsNumber, IsNotEmpty, Min, Length, IsOptional, MinLength } from "class-validator";

export class updateProductDto {

  @IsString({ message: "title should be string, custom message" })
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  price?: number
}