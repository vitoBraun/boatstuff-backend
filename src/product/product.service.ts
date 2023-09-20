import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getProductById(id: number): Promise<Product> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    return existingProduct;
  }
  async createProduct(product: CreateProductDto) {
    if (product.subcategoryId) {
      const exist = await this.checkForSubcategoryExist(
        Number(product.subcategoryId),
      );
      if (!exist) {
        throw new Error('Subcategory not found');
      }
    }

    return await this.prisma.product.create({
      data: product,
    });
  }

  async editProduct(product: CreateProductDto & { id: number }) {
    if (product.subcategoryId) {
      const existingSubcategory = await this.checkForSubcategoryExist(
        product.subcategoryId,
      );
      if (!existingSubcategory) {
        throw new Error('Subcategory not found');
      }
    }

    return (
      this.prisma.product.update({
        where: { id: product.id },
        data: product,
      }) ?? new Error('Product not found')
    );
  }

  async getProductList({
    subcategoryId,
    categoryId,
  }: {
    subcategoryId?: number;
    categoryId?: number;
  }): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        subcategoryId,
        categoryId,
      },
    });
  }

  async checkForSubcategoryExist(subcategoryId: number) {
    const existingSubcategory = await this.prisma.subcategory.findUnique({
      where: { id: subcategoryId },
    });
    if (!existingSubcategory) {
      return false;
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
