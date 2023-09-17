import { Product } from '@prisma/client';
import { ProductService } from './product.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  async getProducts(): Promise<Product[]> {
    return this.productService.getProductList();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return 'Product ' + id;
  }

  @Post()
  async createProduct(
    @Body()
    productData: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(productData);
  }
}
