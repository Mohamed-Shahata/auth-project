import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { updateProductDto } from "./dtos/update-product.dto";
import { ProductService } from "./products.service";
import { AuthRolesGuard } from "src/users/guards/auth.roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enum";
import { JWTPayloadType } from "src/utils/types";
import { CurrentUser } from "src/users/decorators/current-user.decorator";

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
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public createNewProduct(@Body() dtos: CreateProductDto, @CurrentUser() payload: JWTPayloadType) {
    return this.productService.createProduct(dtos, payload.id);
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
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public updateProduct(@Param("id", ParseIntPipe) id: number, @Body() dtos: updateProductDto) {
    return this.productService.update(id, dtos);
  }

  // DELETE: ~/api/products/:id
  @Delete("/:id")
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}