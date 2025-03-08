import { IsString, IsNumber, IsNotEmpty, Min, Length, IsOptional } from "class-validator";

export class updateProductDto {

  @IsString({ message: "title should be string, custom message" })
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  price?: number
}