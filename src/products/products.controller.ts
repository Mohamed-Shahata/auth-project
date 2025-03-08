import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { updateProductDto } from "./dtos/update-product.dto";
import { ProductService } from "./products.service";

// Important Note
/*
  class Person { };
  // Is-A RelationShip
  // Student is a Person
  class Student extends Person { };


  class SendEmail {};
  // Has-A RelationShip
  // Acount has sendEmail
  class Acount{
  private sendEmail:SendEmail = new SendEmail()
  }
*/

@Controller("/api/products")
export class ProductsController {

  constructor(private readonly productService: ProductService) { };


  // POST: ~/api/products
  @Post()
  public createNewProduct(@Body() dtos: CreateProductDto) {
    return this.productService.createProduct(dtos);
  }

  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.productService.getAll()
  }

  // GET: ~/api/products/:id
  @Get("/:id")
  public getSingleProducts(@Param("id", ParseIntPipe) id: number) {
    return this.productService.getOneBy(id);
  }

  // PUT: ~/api/products/:id
  @Put("/:id")
  public updateProduct(@Param("id", ParseIntPipe) id: number, @Body() dtos: updateProductDto) {
    return this.productService.update(id, dtos);
  }

  // DELETE: ~/api/products/:id
  @Delete("/:id")
  public deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}