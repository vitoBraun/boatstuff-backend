import { Injectable } from '@nestjs/common';
import { Category, Subcategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
} from './dto/create.category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    return await this.prisma.category.create({
      data: categoryData,
      include: { subcategories: true },
    });
  }

  async createSubcategory(
    subcategoryData: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    return await this.prisma.subcategory.create({
      data: subcategoryData,
    });
  }

  async getCategoriesList(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  }

  async getSubcategoriesList(categoryId?: number): Promise<Subcategory[]> {
    return this.prisma.subcategory.findMany({
      where: { categoryId: categoryId ? categoryId : undefined },
      include: {
        category: true,
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
      include: {
        subcategories: true,
      },
    });
  }

  async deleteSubcategory(id: number) {
    return this.prisma.subcategory.delete({ where: { id } });
  }
}
