import { IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator";

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  title: string;

  @IsNumber()
  @Min(0)
  price: number;
}