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
    }
    return await this.prisma.product.create({
      data: { ...product, categories: { connect: product.categories } },
      include: { categories: true },
    });
  }

  async editProduct(product: CreateProductDto & { id: number }) {
    if (product.categories) {
      const existingCategory = await this.checkForCategoriesExist(
        product.categories,
      );
      if (!existingCategory) {
        throw new Error('Category not found');
      }
    }

    return (
      this.prisma.product.update({
        where: { id: product.id },
        data: { ...product, categories: { set: product.categories } },
        include: { categories: true },
      }) ?? new Error('Product not found')
    );
  }

  async getProductList(categoryId?: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        categories: {
          some: {
            id: {
              equals: categoryId,
            },
          },
        },
      },
      include: { categories: true },
    });
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
