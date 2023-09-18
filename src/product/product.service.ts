import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async createProduct(product: CreateProductDto) {
    const exist = await this.checkForCategoriesExist(product.categories);
    if (!exist) {
      throw new Error('Category not found');
    } else {
      return await this.prisma.product.create({
        data: { ...product, categories: { connect: product.categories } },
        include: { categories: true },
      });
    }
  }

  async getProductList(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async checkForCategoriesExist(categories: Array<{ id: number }>) {
    for (const category of categories) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id: category.id },
      });
      if (!existingCategory) {
        return false;
      }
    }
    return true;
  }

  async deleteProduct(id: number): Promise<Product> {
    const existingProduct = await this.prisma.product.delete({ where: { id } });
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    return existingProduct;
  }
}
