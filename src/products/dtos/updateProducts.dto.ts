import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class UpdateProductDto {

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(3, 150)
  title?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}