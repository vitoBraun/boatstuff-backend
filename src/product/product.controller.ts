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
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  async getProducts(
    @Query('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return this.productService.getProductList(categoryId && Number(categoryId));
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

  @Patch()
  async editProduct(
    @Body()
    productData: CreateProductDto & { id: number },
  ) {
    return await this.productService.editProduct(productData).catch((error) => {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
