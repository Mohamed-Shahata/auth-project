import { Body, Injectable, NotFoundException, Param, ParseIntPipe } from "@nestjs/common";
import { CreateProductDto } from "./dtos/createProducts.dto";
import { UpdateProductDto } from "./dtos/updateProducts.dto";

type Product = {
  id: number,
  title: string,
  price: number
}

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 1, title: "produt1", price: 50 },
    { id: 2, title: "produt2", price: 90 },
    { id: 3, title: "produt3", price: 70 },
    { id: 4, title: "produt4", price: 550 }
  ];

  /**
   * Create product
   */
  public create(@Body() { title, price }: CreateProductDto) {
    const newProduct: Product = {
      id: this.products.length + 1,
      title,
      price
    }
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Get all products
   */
  public getAll() {
    return this.products;
  }

  /**
   * Get product by id
   */
  public getBy(@Param("id", ParseIntPipe) id: number) {
    const product = this.products.find(p => p.id === id);
    if (!product)
      throw new NotFoundException("Product not found");
    return product;
  }

  /**
   * Update product
   */
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductDto
  ) {
    const product = this.products.find(p => p.id === id);
    if (!product)
      throw new NotFoundException("Product not found");
    return { message: "success update" };
  }

  /**
   * Delete product
   */
  public delete(@Param("id", ParseIntPipe) id: number) {
    const product = this.products.find(p => p.id === id);
    if (!product)
      throw new NotFoundException("Product not found");
    return { message: "Product delete" };
  }
}