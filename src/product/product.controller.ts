import { Product } from '@prisma/client';
import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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

  @Delete(':id')
  async deleteProductById(@Param('id') id: string) {
    return await this.productService.deleteProduct(Number(id)).catch(() => {
      throw new HttpException(
        {
          message: 'Bad request, probably not existed product',
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Post()
  async createProduct(
    @Body()
    productData: CreateProductDto,
  ) {
    return await this.productService
      .createProduct(productData)
      .catch((error) => {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
