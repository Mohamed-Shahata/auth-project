import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe
} from "@nestjs/common";
import { CreateProductDto } from "./dtos/createProducts.dto";
import { UpdateProductDto } from "./dtos/updateProducts.dto";
import { ProductService } from "./products.service";

@Controller("/api/products")
export class ProductsController {

  constructor() { };

  private readonly productService: ProductService = new ProductService();
  // POST ~/api/products
  @Post()
  public createNewProduct(@Body() { title, price }: CreateProductDto) {
    return this.productService.create({ title, price })
  }

  // GET ~/api/products
  @Get()
  public getAllProducts() {
    return this.productService.getAll();
  }

  // GET ~/api/products/:id
  @Get("/:id")
  public getSingleProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.getBy(id);
  }

  // PUT ~/api/products/:id
  @Put("/:id")
  public updateProduct(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
    return this.productService.update(id, body);
  }

  // DELETE ~/api/products/:id
  @Delete("/:id")
  public deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
};