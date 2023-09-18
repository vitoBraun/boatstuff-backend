import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create.category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    if (!categoryData.level) {
      categoryData.level = 1;
    }
    if (categoryData.predecessors?.length > 0) {
      categoryData.level = categoryData.level + 1;
    }
    const createdCategory = await this.prisma.category.create({
      data: {
        ...categoryData,
        predecessors: {
          connect: categoryData.predecessors,
        },
      },
      include: { predecessors: true },
    });
    const errors = [];
    categoryData.predecessors?.forEach(async (predecessor) => {
      if (predecessor.id === createdCategory.id) {
        errors.push(predecessor.id);
      }
    });
    if (errors.length > 0) {
      await this.prisma.category.delete({ where: { id: createdCategory.id } });
      throw new Error(
        `Predecessor ${errors.map(
          (error) => `${error}, `,
        )} cannot be same as category id`,
      );
    }
    return createdCategory;
  }

  async getCategoriesList(level: number = 1): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { level },
      include: {
        predecessors: true,
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
