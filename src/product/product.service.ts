import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async createProduct(product: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: { ...product, categories: { connect: product.categories } },
        include: { categories: true },
      });
    } catch (error) {
      return new Error('Could not create product');
    }
  }

  async getProductList(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async checkForCategoriesExist(categories: Array<{ id: number }>) {
    categories.forEach(async (category) => {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id: category.id },
      });
      if (!existingCategory) {
        return new Error('Category not found');
      }
    });
  }
  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
